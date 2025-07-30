const db = require("../utils/db");

exports.getLeaderboard = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT username, name, COUNT(DISTINCT problem_id) AS problems_solved, SUM(marks) AS score, MAX(timestamp) AS last_submission
      FROM submissions
      GROUP BY username, name
      ORDER BY score DESC, last_submission ASC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch leaderboard", details: err.message });
  }
};
