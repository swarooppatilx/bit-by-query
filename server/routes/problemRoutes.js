const express = require("express");
const { getAllProblems, getProblemById } = require("../controllers/problemController");
const authenticateToken = require("../middleware/authenticateToken");
const { apiRateLimiter } = require("../middleware/rateLimiting");
const router = express.Router();

router.get("/problems", authenticateToken, apiRateLimiter, getAllProblems);
router.get("/problems/:id", authenticateToken, apiRateLimiter, getProblemById);

module.exports = router;