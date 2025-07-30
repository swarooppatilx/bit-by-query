const sqlite3 = require("sqlite3").verbose();
const db = require("../utils/db");
const mysqlToSQLiteParser = require("../utils/mysqlToSQLiteParser");

exports.getUserSubmissions = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM submissions WHERE username = ?", [req.user.username]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch submissions", details: err.message });
  }
};

exports.evaluateProblem = async (req, res) => {
  const problems = req.app.locals.problems;
  const problemId = req.params.id;
  const { userQuery } = req.body;

  if (!userQuery) return res.status(400).json({ error: "User query is required" });

  const problem = problems.find(p => p.id == problemId);
  if (!problem) return res.status(404).json({ error: "Problem not found" });

  const start = Date.now();
  let allPassed = true;
  const testResults = [];

  const queries = userQuery.split(";").map(q => q.trim()).filter(Boolean);
  const parsedQueries = queries.map(q => mysqlToSQLiteParser(q));

  for (let i = 0; i < problem.testCases.length; i++) {
    const testCase = problem.testCases[i];
    const dbMem = new sqlite3.Database(":memory:");

    try {
      const schema = mysqlToSQLiteParser(problem.schema);
      const data = mysqlToSQLiteParser(testCase.sampleData);

      await new Promise((resolve, reject) => {
        dbMem.serialize(() => {
          dbMem.run(schema, err => err && reject(err));
          dbMem.exec(data, err => err && reject(err));
          resolve();
        });
      });

      let lastResult;
      for (const query of parsedQueries) {
        lastResult = await new Promise((resolve, reject) => {
          dbMem.all(query, [], (err, rows) => (err ? reject(err) : resolve(rows)));
        });
      }

      const passed = JSON.stringify(lastResult) === JSON.stringify(testCase.expectedOutput);
      if (!passed) allPassed = false;

      testResults.push({ testCaseNumber: i + 1, passed, userOutput: lastResult, expectedOutput: testCase.expectedOutput });
    } catch (err) {
      allPassed = false;
      testResults.push({ testCaseNumber: i + 1, passed: false, error: err.message });
    } finally {
      dbMem.close();
    }
  }

  if (allPassed) {
    try {
      const [existing] = await db.execute("SELECT * FROM submissions WHERE username = ? AND problem_id = ?", [req.user.username, problemId]);
      if (!existing.length) {
        const [user] = await db.execute("SELECT name FROM users WHERE username = ?", [req.user.username]);
        const userName = user[0].name;
        await db.execute("INSERT INTO submissions (username, name, problem_id, marks, timestamp) VALUES (?, ?, ?, ?, UNIX_TIMESTAMP())", [req.user.username, userName, problemId, problem.marks]);
      }
    } catch (err) {
      console.error("DB Error:", err.message);
    }
  }

  res.json({ correct: allPassed, testResults, duration: `${Date.now() - start}ms` });
};
