const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../utils/db");
const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret";

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Missing credentials" });

  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
    if (!rows.length) return res.status(400).json({ error: "User not found" });

    const isValid = await bcrypt.compare(password, rows[0].password_hash);
    if (!isValid) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "3h" });
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 3 * 60 * 60 * 1000 
    });

    res.status(201).json({ message: "Login successful" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
};

exports.register = async (req, res) => {
  const { username, password, name } = req.body;
  if (!username || !password || !name) return res.status(400).json({ error: "All fields required" });

  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
    if (rows.length) return res.status(400).json({ error: "Username taken" });

    const hashed = await bcrypt.hash(password, 10);
    await db.execute("INSERT INTO users (username, password_hash, name) VALUES (?, ?, ?)", [username, hashed, name]);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
};

exports.logout=async (req,res) => {
  res.clearCookie("token");
  return res.status(201).json({message:"LogOut Successful"});
};