const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const mysql = require("mysql2/promise"); // Use mysql2 for async/await support
const fs = require("fs");
const mysqlToSQLiteParser = require("./lib/mysqlToSQLiteParser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = 5000;

const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret";

// Middleware
app.use(bodyParser.json());

// Serve the Vite build (client/dist)
app.use(express.static(path.join(__dirname, "client/dist")));

const problemsDirectory = path.join(__dirname, "problems");
const problemsFile = path.join(problemsDirectory, "jan2025.json");

let problems = [];

// Check if the file exists and load the problems
if (fs.existsSync(problemsFile)) {
  problems = JSON.parse(fs.readFileSync(problemsFile, "utf-8"));
} else {
  console.error("Problems file not found.");
}

// Middleware to handle errors
const handleErrors = (err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ error: "Internal Server Error", details: err.message });
};

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 200, // Maximum number of connections in the pool
  queueLimit: 0, // Unlimited queue length
});

// Middleware to attach pool to req object
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// Route: User login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    // Fetch user from MySQL database
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = rows[0];

    // Compare the password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ username: user.username }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route: User Registration
app.post("/api/register", async (req, res) => {
  const { username, password, name } = req.body;

  if (!username || !password || !name) {
    return res
      .status(400)
      .json({ error: "Username, password, and name are required" });
  }

  try {
    // Check if the user already exists
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (rows.length > 0) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await pool.execute(
      "INSERT INTO users (username, password_hash, name) VALUES (?, ?, ?)",
      [username, hashedPassword, name]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/userinfo", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE username = ?",
      [req.user.username]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = rows[0];
    // Exclude the password hash for security
    const { password_hash, ...userInfo } = user;

    res.json(userInfo);
  } catch (err) {
    console.error("Error fetching user info:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route: Fetch all problems (protected)
app.get("/api/problems", authenticateToken, (req, res) => {
  if (problems.length === 0) {
    return res.status(404).json({ error: "No problems available" });
  }
  res.json(problems);
});

app.get("/api/submissions", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM submissions WHERE username = ?",
      [req.user.username]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching submissions:", err.message);
    res.status(500).json({
      error: "Failed to fetch submissions",
      details: err.message,
    });
  }
});

// Route: Fetch a specific problem by ID (protected)
app.get("/api/problems/:id", authenticateToken, (req, res) => {
  const problemId = req.params.id;
  const problem = problems.find((p) => p.id == problemId);

  if (!problem) {
    return res.status(404).json({ error: "Problem not found" });
  }
  res.json(problem);
});

app.post("/api/problems/:id/evaluate", authenticateToken, async (req, res) => {
  const problemId = req.params.id;
  const { userQuery } = req.body;

  if (!userQuery) {
    return res.status(400).json({ error: "User query is required" });
  }

  const problem = problems.find((p) => p.id == problemId);
  if (!problem) {
    return res.status(404).json({ error: "Problem not found" });
  }

  const start = Date.now();
  let allTestCasesPassed = true;
  const testResults = [];

  // Parse user queries once
  const queries = userQuery
    .split(";")
    .map((q) => q.trim())
    .filter((q) => q);

  const parsedQueries = queries.map((query) => {
    try {
      return mysqlToSQLiteParser(query);
    } catch (err) {
      console.error("Error parsing query:", err);
      throw new Error("Failed to parse query");
    }
  });

  // Run each test case
  for (let i = 0; i < problem.testCases.length; i++) {
    const testCase = problem.testCases[i];
    const db = new sqlite3.Database(":memory:");
    const parsedSchema = mysqlToSQLiteParser(problem.schema);
    const parsedSampleData = mysqlToSQLiteParser(testCase.sampleData);

    try {
      // Set up database for this test case
      await new Promise((resolve, reject) => {
        db.serialize(() => {
          db.run(parsedSchema, (err) => {
            if (err) reject(err);
            db.exec(parsedSampleData, (err) => {
              if (err) reject(err);
              resolve();
            });
          });
        });
      });

      // Execute user queries
      let lastResult;
      for (const query of parsedQueries) {
        lastResult = await new Promise((resolve, reject) => {
          db.all(query, [], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
          });
        });
      }

      const isCorrect =
        JSON.stringify(lastResult) === JSON.stringify(testCase.expectedOutput);
      if (!isCorrect) allTestCasesPassed = false;

      testResults.push({
        testCaseNumber: i + 1,
        passed: isCorrect,
        userOutput: lastResult,
        expectedOutput: testCase.expectedOutput,
      });
    } catch (err) {
      testResults.push({
        testCaseNumber: i + 1,
        passed: false,
        error: err.message,
      });
      allTestCasesPassed = false;
    } finally {
      db.close();
    }
  }

  const duration = Date.now() - start;

  // Handle submission if all test cases passed
  if (allTestCasesPassed) {
    try {
      const [existingSubmission] = await pool.execute(
        "SELECT * FROM submissions WHERE username = ? AND problem_id = ?",
        [req.user.username, problemId]
      );

      if (existingSubmission.length > 0) {
        return res.status(400).json({
          error: "Duplicate submission",
          details: "You have already solved this problem",
        });
      }

      const [userRows] = await pool.execute(
        "SELECT name FROM users WHERE username = ?",
        [req.user.username]
      );

      if (userRows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const userName = userRows[0].name;

      await pool.execute(
        "INSERT INTO submissions (username, name, problem_id, marks, timestamp) VALUES (?, ?, ?, ?, UNIX_TIMESTAMP())",
        [req.user.username, userName, problemId, problem.marks]
      );
    } catch (dbErr) {
      console.error("Error saving submission:", dbErr.message);
      return res.status(500).json({
        error: "Failed to save submission",
        details: dbErr.message,
      });
    }
  }

  res.json({
    correct: allTestCasesPassed,
    testResults,
    duration: `${duration}ms`,
  });
});

app.get("/api/leaderboard", async (req, res) => {
  try {
    // Query to find the leaderboard including total marks
    const query = `
      SELECT 
        username,
        name,
        COUNT(DISTINCT problem_id) AS problems_solved, 
        SUM(marks) AS score,
        MAX(timestamp) AS last_submission
      FROM 
        submissions
      GROUP BY 
        username, name
      ORDER BY 
        score DESC,
        last_submission ASC;`;

    const [rows] = await pool.execute(query);

    // Directly return the rows array
    res.json(rows);
  } catch (err) {
    console.error("Error fetching leaderboard:", err.message);
    res.status(500).json({
      error: "Failed to fetch leaderboard",
      details: err.message,
    });
  }
});

// Fallback to serve `index.html` for non-API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist/index.html"));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling middleware
app.use(handleErrors);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Gracefully close the pool on app termination
process.on("SIGINT", async () => {
  try {
    await pool.end();
    console.log("MySQL connection pool closed.");
    process.exit(0);
  } catch (err) {
    console.error("Error closing MySQL connection pool:", err.message);
    process.exit(1);
  }
});
