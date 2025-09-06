const sqlite3 = require("sqlite3").verbose();
const db = require("../utils/db");
const solver = require("../utils/solver");
const mysqlToSQLiteParser = require("../utils/mysqlToSQLiteParser");

function generateId(length) {
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

exports.getUserSubmissions = async (req, res) => {
	try {
		const [rows] = await db.execute(
			"SELECT * FROM submissions WHERE username = ?",
			[req.user.username]
		);
		res.json(rows);
	} catch (err) {
		res
			.status(500)
			.json({ error: "Failed to fetch submissions", details: err.message });
	}
};

exports.evaluateProblem = async (req, res) => {
	const problems = req.app.locals.problems;
	const problemId = req.params.id;
	const { userQuery } = req.body;

	if (!userQuery)
		return res.status(400).json({ error: "User query is required" });

	const problem = problems.find((p) => p.id == problemId);
	if (!problem) return res.status(404).json({ error: "Problem not found" });

	const start = Date.now();
	let allPassed = true;
	const testResults = [];

	const queries = userQuery
		.split(";")
		.map((q) => q.trim())
		.filter(Boolean);

	for (let i = 0; i < problem.testCases.length; i++) {
		const testCase = problem.testCases[i];
		const solveDb = await solver.solvePool.getConnection();

		const dbId = `${generateId(5)}_${Date.now()}`;

		await solveDb.execute(`CREATE DATABASE \`${dbId}\``);
		await solveDb.execute(
			`GRANT SELECT ON ${dbId}.* TO '${solver.readonlyUser.user}'@'localhost'`
		);
		await solveDb.changeUser({ database: dbId });
		try {
			const schema = problem.schema;
			const data = testCase.sampleData;

			await solveDb.beginTransaction();
			await solveDb.query(schema);
			await solveDb.query(data);
			await solveDb.commit();

			await solveDb.changeUser(solver.readonlyUser);
			let lastResult;
			for (const query of queries) {
				const queryResult = await solveDb.query(query);

				lastResult = queryResult[0];
			}

			const passed =
				JSON.stringify(lastResult) === JSON.stringify(testCase.expectedOutput);
			if (!passed) allPassed = false;

			testResults.push({
				testCaseNumber: i + 1,
				passed,
				userOutput: lastResult,
				expectedOutput: testCase.expectedOutput,
			});
		} catch (err) {
			allPassed = false;
			testResults.push({
				testCaseNumber: i + 1,
				passed: false,
				error: err.message,
			});
		} finally {
			await solveDb.changeUser({
				...solver.adminUser,
				database: "information_schema",
			});
			await solveDb.execute(`DROP DATABASE \`${dbId}\``);
		}
	}

	if (allPassed) {
		try {
			const [existing] = await db.execute(
				"SELECT * FROM submissions WHERE username = ? AND problem_id = ?",
				[req.user.username, problemId]
			);
			if (!existing.length) {
				const [user] = await db.execute(
					"SELECT name FROM users WHERE username = ?",
					[req.user.username]
				);
				const userName = user[0].name;
				await db.execute(
					"INSERT INTO submissions (username, name, problem_id, marks, timestamp) VALUES (?, ?, ?, ?, UNIX_TIMESTAMP())",
					[req.user.username, userName, problemId, problem.marks]
				);
			}
		} catch (err) {
			console.error("DB Error:", err.message);
		}
	}

	res.json({
		correct: allPassed,
		testResults,
		duration: `${Date.now() - start}ms`,
	});
};
