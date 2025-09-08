const express = require("express");
const { getUserSubmissions, evaluateProblem } = require("../controllers/submissionController");
const authenticateToken = require("../middleware/authenticateToken");
const { apiRateLimiter } = require("../middleware/rateLimiting");
const router = express.Router();

router.get("/submissions", authenticateToken, apiRateLimiter, getUserSubmissions);
router.post("/problems/:id/evaluate", authenticateToken, apiRateLimiter, evaluateProblem);

module.exports = router;