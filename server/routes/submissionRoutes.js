const express = require("express");
const { getUserSubmissions, evaluateProblem } = require("../controllers/submissionController");
const authenticateToken = require("../middleware/authenticateToken");
const router = express.Router();

router.get("/submissions", authenticateToken, getUserSubmissions);
router.post("/problems/:id/evaluate", authenticateToken, evaluateProblem);

module.exports = router;
