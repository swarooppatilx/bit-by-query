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
// // Enable CORS for all routes
// app.use(cors({origin: '*'}));

// Load problems from JSON file
const problemsFile = "problems.json";
let problems = [];

if (fs.existsSync(problemsFile)) {
  problems = JSON.parse(fs.readFileSync(problemsFile, "utf-8"));
}

// API to fetch all problems
app.get("/api/problems", (req, res) => {
  console.log(`GET /api/problems`);
  res.json(problems);
});

// API to evaluate user query
app.post("/api/evaluate", (req, res) => {
  const { problemId, userQuery } = req.body;

  // Performance measurement start
  const start = Date.now();

  console.log(
    `POST /api/evaluate - problemId: ${problemId}, userQuery: ${userQuery}`
  );

  if (!problemId || !userQuery) {
    console.error(`Missing required parameters: problemId or userQuery`);
    return res
      .status(400)
      .json({ error: "Problem ID and user query are required" });
  }

  const problem = problems.find((p) => p.id == problemId);

  if (!problem) {
    console.error(`Problem not found for ID: ${problemId}`);
    return res.status(404).json({ error: "Problem not found" });
  }

  const db = new sqlite3.Database(":memory:");

  const parsedSchema = mysqlToSQLiteParser(problem.schema);
  const parsedSampleData = mysqlToSQLiteParser(problem.sampleData);
  const parsedUserQuery = mysqlToSQLiteParser(userQuery);

  db.serialize(() => {
    console.log("Creating table...");
    // Create table
    db.run(parsedSchema, (err) => {
      if (err) {
        console.error(`Error creating table: ${err.message}`);
      }
    });

    console.log("Inserting sample data...");
    // Insert sample data
    db.exec(parsedSampleData, (err) => {
      if (err) {
        console.error(`Error inserting sample data: ${err.message}`);
      }
    });

    console.log("Evaluating user query...");
    // Evaluate user query
    db.all(parsedUserQuery, [], (err, rows) => {
      db.close();

      if (err) {
        console.error(`Error executing query: ${err.message}`);
        return res
          .status(400)
          .json({ error: "Query execution failed", details: err.message });
      }

      const isCorrect =
        JSON.stringify(rows) === JSON.stringify(problem.expectedOutput);
      const duration = Date.now() - start;

      console.log(`Query evaluation completed in ${duration}ms`);

      res.json({
        correct: isCorrect,
        userOutput: rows,
        expectedOutput: problem.expectedOutput,
        duration: `${duration}ms`, // Add duration in response
      });
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
