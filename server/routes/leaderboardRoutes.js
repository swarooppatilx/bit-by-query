const express = require("express");
const { getLeaderboard } = require("../controllers/leaderboardController");
const router = express.Router();

router.get("/leaderboard", getLeaderboard);

module.exports = router;