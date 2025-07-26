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

// Environment variables validation
const requiredEnvVars = ['JWT_SECRET', 'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`Error: ${envVar} is not set in environment variables`);
        process.exit(1);
    }
}

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// Security middleware
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));

// CORS middleware with configurable origins
app.use((req, res, next) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'];
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    }

    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Rate limiting middleware
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Serve static files
app.use(express.static(path.join(__dirname, "..", "client/dist")));

// Load problems with error handling
const problemsDirectory = path.join(__dirname, "data", "problems");
const problemsFile = path.join(problemsDirectory, "jan2025.json");

let problems = [];
try {
    if (fs.existsSync(problemsFile)) {
        const data = fs.readFileSync(problemsFile, "utf-8");
        problems = JSON.parse(data);
        if (!Array.isArray(problems)) {
            throw new Error("Problems data is not an array");
        }
    } else {
        console.error("Problems file not found:", problemsFile);
    }
} catch (error) {
    console.error("Error loading problems:", error.message);
}

// Database configuration
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Middleware to attach pool to req object
app.use((req, res, next) => {
    req.db = pool;
    next();
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Access token required" });
    }

    try {
        const user = jwt.verify(token, JWT_SECRET);
        req.user = user;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Token expired" });
        }
        return res.status(403).json({ error: "Invalid token" });
    }
};

// Helper function to safely parse and execute SQLite queries
async function executeSQLiteQuery(db, query, params = []) {
    return new Promise((resolve, reject) => {
        try {
            db.all(query, params, (err, rows) => {
                if (err) {
                    if (err.message.includes('no such table')) {
                        reject(new Error('Table not found. Please check your query.'));
                    } else if (err.message.includes('syntax error')) {
                        reject(new Error('SQL syntax error. Please check your query.'));
                    } else {
                        reject(new Error('Database error occurred.'));
                    }
                } else {
                    resolve(rows);
                }
            });
        } catch (err) {
            reject(new Error('Query execution failed.'));
        }
    });
}

// Helper function to set up SQLite database
async function setupSQLiteDatabase(db, schema, sampleData) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            try {
                // Execute schema
                db.run(schema, (err) => {
                    if (err) reject(new Error('Error setting up database schema.'));
                    // Execute sample data
                    db.exec(sampleData, (err) => {
                        if (err) reject(new Error('Error loading sample data.'));
                        resolve();
                    });
                });
            } catch (err) {
                reject(new Error('Database setup failed.'));
            }
        });
    });
}

// Authentication routes
app.post("/api/login", async(req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    try {
        const [rows] = await pool.execute(
            "SELECT * FROM users WHERE username = ?", [username]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ username: user.username }, JWT_SECRET, {
            expiresIn: "3h"
        });

        res.json({ token });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Authentication failed" });
    }
});

app.post("/api/register", async(req, res) => {
    const { username, password, name } = req.body;

    if (!username || !password || !name) {
        return res.status(400).json({ error: "Username, password, and name are required" });
    }

    if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }

    try {
        const [existing] = await pool.execute(
            "SELECT id FROM users WHERE username = ?", [username]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: "Username is already taken" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.execute(
            "INSERT INTO users (username, password_hash, name) VALUES (?, ?, ?)", [username, hashedPassword, name]
        );

        res.status(201).json({ message: "Registration successful" });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ error: "Registration failed" });
    }
});

// Protected routes
app.get("/api/userinfo", authenticateToken, async(req, res) => {
    try {
        const [rows] = await pool.execute(
            "SELECT id, username, name, created_at FROM users WHERE username = ?", [req.user.username]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error("Error fetching user info:", err);
        res.status(500).json({ error: "Failed to fetch user information" });
    }
});

app.get("/api/problems", authenticateToken, (req, res) => {
    if (!problems || problems.length === 0) {
        return res.status(404).json({ error: "No problems available" });
    }
    res.json(problems);
});

app.get("/api/submissions", authenticateToken, async(req, res) => {
    try {
        const [rows] = await pool.execute(
            "SELECT * FROM submissions WHERE username = ? ORDER BY timestamp DESC", [req.user.username]
        );
        res.json(rows);
    } catch (err) {
        console.error("Error fetching submissions:", err);
        res.status(500).json({ error: "Failed to fetch submissions" });
    }
});

app.get("/api/problems/:id", authenticateToken, (req, res) => {
    const problemId = parseInt(req.params.id);
    if (isNaN(problemId)) {
        return res.status(400).json({ error: "Invalid problem ID" });
    }

    const problem = problems.find(p => p.id === problemId);
    if (!problem) {
        return res.status(404).json({ error: "Problem not found" });
    }

    res.json(problem);
});

app.post("/api/problems/:id/evaluate", authenticateToken, async(req, res) => {
    try {
        const problemId = parseInt(req.params.id);
        if (isNaN(problemId)) {
            return res.status(400).json({ error: "Invalid problem ID" });
        }

        const { userQuery } = req.body;
        if (!userQuery || typeof userQuery !== 'string') {
            return res.status(400).json({ error: "Valid SQL query is required" });
        }

        const problem = problems.find(p => p.id === problemId);
        if (!problem) {
            return res.status(404).json({ error: "Problem not found" });
        }

        const start = Date.now();
        let allTestCasesPassed = true;
        const testResults = [];

        // Parse user queries
        const queries = userQuery
            .split(";")
            .map(q => q.trim())
            .filter(q => q);

        const parsedQueries = queries.map(query => {
            try {
                return mysqlToSQLiteParser(query);
            } catch (err) {
                throw new Error("Invalid SQL query syntax");
            }
        });

        // Run test cases
        for (let i = 0; i < problem.testCases.length; i++) {
            const testCase = problem.testCases[i];
            const db = new sqlite3.Database(":memory:");

            try {
                const parsedSchema = mysqlToSQLiteParser(problem.schema);
                const parsedSampleData = mysqlToSQLiteParser(testCase.sampleData);

                await setupSQLiteDatabase(db, parsedSchema, parsedSampleData);

                let lastResult;
                for (const query of parsedQueries) {
                    lastResult = await executeSQLiteQuery(db, query);
                }

                const isCorrect = JSON.stringify(lastResult) === JSON.stringify(testCase.expectedOutput);
                if (!isCorrect) allTestCasesPassed = false;

                testResults.push({
                    testCaseNumber: i + 1,
                    passed: isCorrect,
                    userOutput: lastResult,
                    expectedOutput: testCase.expectedOutput,
                    error: null
                });
            } catch (err) {
                testResults.push({
                    testCaseNumber: i + 1,
                    passed: false,
                    error: err.message
                });
                allTestCasesPassed = false;
            } finally {
                db.close();
            }
        }

        const duration = Date.now() - start;

        // Handle successful submission
        if (allTestCasesPassed) {
            try {
                const [existing] = await pool.execute(
                    "SELECT id FROM submissions WHERE username = ? AND problem_id = ?", [req.user.username, problemId]
                );

                if (existing.length > 0) {
                    return res.status(400).json({ error: "You have already solved this problem" });
                }

                const [user] = await pool.execute(
                    "SELECT name FROM users WHERE username = ?", [req.user.username]
                );

                if (user.length === 0) {
                    return res.status(404).json({ error: "User not found" });
                }

                await pool.execute(
                    "INSERT INTO submissions (username, name, problem_id, marks, timestamp) VALUES (?, ?, ?, ?, UNIX_TIMESTAMP())", [req.user.username, user[0].name, problemId, problem.marks]
                );
            } catch (err) {
                console.error("Error saving submission:", err);
                return res.status(500).json({ error: "Failed to save submission" });
            }
        }

        res.json({
            correct: allTestCasesPassed,
            testResults,
            duration: `${duration}ms`
        });
    } catch (err) {
        console.error("Evaluation error:", err);
        res.status(500).json({ error: "Evaluation failed" });
    }
});

app.get("/api/leaderboard", async(req, res) => {
    try {
        const query = `
            SELECT 
                username,
                name,
                COUNT(DISTINCT problem_id) as problems_solved,
                SUM(marks) as total_score,
                MAX(timestamp) as last_submission
            FROM submissions
            GROUP BY username, name
            ORDER BY total_score DESC, last_submission ASC
            LIMIT 100
        `;

        const [rows] = await pool.execute(query);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching leaderboard:", err);
        res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
});

// Fallback routes
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "client/dist/index.html"));
});

app.use("/api/*", (req, res) => {
    res.status(404).json({ error: "API endpoint not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal server error" });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", async() => {
    console.log("\nGracefully shutting down...");
    try {
        await server.close();
        await pool.end();
        console.log("Server and database connections closed.");
        process.exit(0);
    } catch (err) {
        console.error("Error during shutdown:", err);
        process.exit(1);
    }
});
