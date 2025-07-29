const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const mysql = require("mysql2/promise");
const fs = require("fs");
const mysqlToSQLiteParser = require("./lib/mysqlToSQLiteParser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret";

app.use(bodyParser.json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Serve static frontend
app.use(express.static(path.join(__dirname, "..", "client/dist")));

const problemsDirectory = path.join(__dirname, "data", "problems");
const problemsFile = path.join(problemsDirectory, "jan2025.json");

let problems = [];

if (fs.existsSync(problemsFile)) {
  problems = JSON.parse(fs.readFileSync(problemsFile, "utf-8"));
} else {
  console.error("Problems file not found.");
}

const handleErrors = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error", details: err.message });
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });
    req.user = user;
    next();
  });
};

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 200,
  queueLimit: 0,
});

app.use((req, res, next) => {
  req.db = pool;
  next();
});

// AUTH: Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Username and password are required" });

  try {
    const [rows] = await pool.execute("SELECT * FROM users WHERE username = ?", [username]);
    if (rows.length === 0) return res.status(400).json({ error: "User not found" });

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: "3h" });
    res.json({ token });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// AUTH: Register
app.post("/api/register", async (req, res) => {
  const { username, password, name } = req.body;
  if (!username || !password || !name) return res.status(400).json({ error: "All fields are required" });

  try {
    const [rows] = await pool.execute("SELECT * FROM users WHERE username = ?", [username]);
    if (rows.length > 0) return res.status(400).json({ error: "Username is already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.execute("INSERT INTO users (username, password_hash, name) VALUES (?, ?, ?)", [username, hashedPassword, name]);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/userinfo", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM users WHERE username = ?", [req.user.username]);
    if (rows.length === 0) return res.status(404).json({ error: "User not found" });

    const { password_hash, ...userInfo } = rows[0];
    res.json(userInfo);
  } catch (err) {
    console.error("Error fetching user info:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/problems", authenticateToken, (req, res) => {
  if (problems.length === 0) return res.status(404).json({ error: "No problems available" });
  res.json(problems);
});

app.get("/api/problems/:id", authenticateToken, (req, res) => {
  const problem = problems.find(p => p.id == req.params.id);
  if (!problem) return res.status(404).json({ error: "Problem not found" });
  res.json(problem);
});

app.post("/api/problems/:id/evaluate", authenticateToken, async (req, res) => {
  const problemId = req.params.id;
  const { userQuery } = req.body;

  if (!userQuery) return res.status(400).json({ error: "User query is required" });

  const problem = problems.find((p) => p.id == problemId);
  if (!problem) return res.status(404).json({ error: "Problem not found" });

  const start = Date.now();
  let allTestCasesPassed = true;
  const testResults = [];

  const queries = userQuery.split(";").map(q => q.trim()).filter(Boolean);
  const parsedQueries = queries.map(q => mysqlToSQLiteParser(q));

  for (let i = 0; i < problem.testCases.length; i++) {
    const db = new sqlite3.Database(":memory:");
    const parsedSchema = mysqlToSQLiteParser(problem.schema);
    const parsedSampleData = mysqlToSQLiteParser(problem.testCases[i].sampleData);

    try {
      await new Promise((resolve, reject) => {
        db.serialize(() => {
          db.run(parsedSchema, err => {
            if (err) return reject(err);
            db.exec(parsedSampleData, err => {
              if (err) return reject(err);
              resolve();
            });
          });
        });
      });

      let lastResult;
      for (const query of parsedQueries) {
        lastResult = await new Promise((resolve, reject) => {
          db.all(query, [], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
          });
        });
      }

      const isCorrect = JSON.stringify(lastResult) === JSON.stringify(problem.testCases[i].expectedOutput);
      if (!isCorrect) allTestCasesPassed = false;

      testResults.push({
        testCaseNumber: i + 1,
        passed: isCorrect,
        userOutput: lastResult,
        expectedOutput: problem.testCases[i].expectedOutput
      });
    } catch (err) {
      testResults.push({ testCaseNumber: i + 1, passed: false, error: err.message });
      allTestCasesPassed = false;
    } finally {
      db.close();
    }
  }

  const duration = Date.now() - start;

  if (allTestCasesPassed) {
    try {
      const [existing] = await pool.execute(
        "SELECT * FROM submissions WHERE username = ? AND problem_id = ?",
        [req.user.username, problemId]
      );
      if (existing.length > 0) return res.status(400).json({ error: "Duplicate submission" });

      const [userRows] = await pool.execute("SELECT name FROM users WHERE username = ?", [req.user.username]);
      if (userRows.length === 0) return res.status(404).json({ error: "User not found" });

      await pool.execute(
        "INSERT INTO submissions (username, name, problem_id, marks, timestamp) VALUES (?, ?, ?, ?, UNIX_TIMESTAMP())",
        [req.user.username, userRows[0].name, problemId, problem.marks]
      );
    } catch (err) {
      console.error("Error saving submission:", err.message);
      return res.status(500).json({ error: "Failed to save submission", details: err.message });
    }
  }

  res.json({ correct: allTestCasesPassed, testResults, duration: `${duration}ms` });
});

// Leaderboard
app.get("/api/leaderboard", async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT username, name, COUNT(DISTINCT problem_id) AS problems_solved,
             SUM(marks) AS score, MAX(timestamp) AS last_submission
      FROM submissions
      GROUP BY username, name
      ORDER BY score DESC, last_submission ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching leaderboard:", err.message);
    res.status(500).json({ error: "Failed to fetch leaderboard", details: err.message });
  }
});

// New: Update progress
app.post("/api/progress", authenticateToken, async (req, res) => {
  const { problemId, status } = req.body;
  const username = req.user.username;

  if (!problemId || !status) return res.status(400).json({ error: "Problem ID and status are required" });

  const validStatuses = ["Solved", "Unsolved", "Review"];
  if (!validStatuses.includes(status)) return res.status(400).json({ error: "Invalid status" });

  try {
    await pool.execute(
      `INSERT INTO user_progress (username, problem_id, status)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE status = VALUES(status)`,
      [username, problemId, status]
    );
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error updating progress:", err.message);
    res.status(500).json({ error: "Failed to update progress", details: err.message });
  }
});

// New: Get progress summary
app.get("/api/progress/:username", authenticateToken, async (req, res) => {
  if (req.params.username !== req.user.username) return res.status(403).json({ error: "Unauthorized access" });

  try {
    const [rows] = await pool.execute(
      `SELECT status, COUNT(*) as count
       FROM user_progress
       WHERE username = ?
       GROUP BY status`,
      [req.params.username]
    );
    const summary = { Solved: 0, Unsolved: 0, Review: 0 };
    rows.forEach(row => { summary[row.status] = row.count; });
    res.status(200).json(summary);
  } catch (err) {
    console.error("Error fetching progress summary:", err.message);
    res.status(500).json({ error: "Failed to fetch progress", details: err.message });
  }
});

// Fallback for frontend routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client/dist/index.html"));
});

app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

app.use(handleErrors);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  try {
    await pool.end();
    process.exit(0);
  } catch (err) {
    process.exit(1);
  }
});
