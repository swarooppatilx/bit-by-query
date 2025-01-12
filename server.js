const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const mysqlToSQLiteParser = require("./lib/mysqlToSQLiteParser");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

// Load problems from JSON file
const problemsFile = "problems.json";
let problems = [];

if (fs.existsSync(problemsFile)) {
  problems = JSON.parse(fs.readFileSync(problemsFile, "utf-8"));
}

// Error handling middleware
const handleErrors = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
};

// Route: Fetch all problems
app.get("/api/problems", (req, res) => {
  console.log(`[GET] /api/problems`);
  if (problems.length === 0) {
    return res.status(404).json({ error: "No problems available" });
  }
  res.json(problems);
});

// Route: Fetch a specific problem by ID
app.get("/api/problems/:id", (req, res) => {
  const problemId = req.params.id;
  console.log(`[GET] /api/problems/${problemId}`);
  const problem = problems.find((p) => p.id == problemId);

  if (!problem) {
    return res.status(404).json({ error: "Problem not found" });
  }
  res.json(problem);
});

// Route: Evaluate user query
app.post("/api/problems/:id/evaluate", (req, res) => {
  const problemId = req.params.id;
  const { userQuery } = req.body;

  console.log(
    `[POST] /api/problems/${problemId}/evaluate - Query: ${userQuery}`
  );

  if (!userQuery) {
    return res.status(400).json({ error: "User query is required" });
  }

  const problem = problems.find((p) => p.id == problemId);

  if (!problem) {
    return res.status(404).json({ error: "Problem not found" });
  }

  // Performance measurement start
  const start = Date.now();

  const db = new sqlite3.Database(":memory:");
  const parsedSchema = mysqlToSQLiteParser(problem.schema);
  const parsedSampleData = mysqlToSQLiteParser(problem.sampleData);
  const parsedUserQuery = mysqlToSQLiteParser(userQuery);

  db.serialize(() => {
    // Create table
    db.run(parsedSchema, (err) => {
      if (err) {
        console.error(`Error creating table: ${err.message}`);
        return res.status(400).json({
          error: "Schema creation failed",
          details: err.message,
        });
      }
    });

    // Insert sample data
    db.exec(parsedSampleData, (err) => {
      if (err) {
        console.error(`Error inserting sample data: ${err.message}`);
        return res.status(400).json({
          error: "Sample data insertion failed",
          details: err.message,
        });
      }
    });

    // Evaluate user query
    db.all(parsedUserQuery, [], (err, rows) => {
      db.close();

      if (err) {
        console.error(`Error executing query: ${err.message}`);
        return res.status(400).json({
          error: "Query execution failed",
          details: err.message,
          sqlState: err.code, // Include SQL error code for better debugging
        });
      }

      const isCorrect =
        JSON.stringify(rows) === JSON.stringify(problem.expectedOutput);
      const duration = Date.now() - start;

      console.log(`Query evaluation completed in ${duration}ms`);

      res.json({
        correct: isCorrect,
        userOutput: rows,
        expectedOutput: problem.expectedOutput,
        duration: `${duration}ms`,
      });
    });
  });
});

// 404 Route
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Use error handling middleware
app.use(handleErrors);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
