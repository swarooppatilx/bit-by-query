const db = require("../utils/db");

exports.getUserInfo = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [req.user.username]);
    if (!rows.length) return res.status(404).json({ error: "User not found" });

    const { password_hash, ...userInfo } = rows[0];
    res.json(userInfo);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
};
