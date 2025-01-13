const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const mysql = require("mysql2/promise"); // Use mysql2 for async/await support
const fs = require("fs");
const mysqlToSQLiteParser = require("./lib/mysqlToSQLiteParser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();
const PORT = 5000;

const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret";

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

// Load users from users.json
const usersFile = "users.json";
let users = [];

if (fs.existsSync(usersFile)) {
  users = JSON.parse(fs.readFileSync(usersFile, "utf-8"));
}

// Load problems from JSON file
const problemsFile = "problems.json";
let problems = [];

if (fs.existsSync(problemsFile)) {
  problems = JSON.parse(fs.readFileSync(problemsFile, "utf-8"));
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

// MySQL Database Connection
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

let db;

// Connect to MySQL Database
async function connectToDatabase() {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log("Connected to MySQL database.");
  } catch (err) {
    console.error("Failed to connect to MySQL database:", err.message);
    process.exit(1);
  }
}

connectToDatabase();

// Route: User login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    // Fetch user from MySQL database
    const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [
      username,
    ]);

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


app.get("/api/userinfo", authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [
      req.user.username,
    ]);

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

// Route: Fetch a specific problem by ID (protected)
app.get("/api/problems/:id", authenticateToken, (req, res) => {
  const problemId = req.params.id;
  const problem = problems.find((p) => p.id == problemId);

  if (!problem) {
    return res.status(404).json({ error: "Problem not found" });
  }
  res.json(problem);
});

// Route: Evaluate user query (protected)
app.post("/api/problems/:id/evaluate", authenticateToken, (req, res) => {
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
  const db = new sqlite3.Database(":memory:");
  const parsedSchema = mysqlToSQLiteParser(problem.schema);
  const parsedSampleData = mysqlToSQLiteParser(problem.sampleData);
  const parsedUserQuery = mysqlToSQLiteParser(userQuery);

  db.serialize(() => {
    db.run(parsedSchema, (err) => {
      if (err) {
        db.close();
        return res.status(400).json({
          error: "Schema creation failed",
          details: err.message,
        });
      }
    });

    db.exec(parsedSampleData, (err) => {
      if (err) {
        db.close();
        return res.status(400).json({
          error: "Sample data insertion failed",
          details: err.message,
        });
      }
    });

    db.all(parsedUserQuery, [], (err, rows) => {
      db.close();

      if (err) {
        return res.status(400).json({
          error: "Query execution failed",
          details: err.message,
        });
      }

      const isCorrect =
        JSON.stringify(rows) === JSON.stringify(problem.expectedOutput);
      const duration = Date.now() - start;

      res.json({
        correct: isCorrect,
        userOutput: rows,
        expectedOutput: problem.expectedOutput,
        duration: `${duration}ms`,
      });
    });
  });
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
