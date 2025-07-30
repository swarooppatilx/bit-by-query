const express = require("express");
const { getAllProblems, getProblemById } = require("../controllers/problemController");
const authenticateToken = require("../middleware/authenticateToken");
const router = express.Router();

router.get("/problems", authenticateToken, getAllProblems);
router.get("/problems/:id", authenticateToken, getProblemById);

module.exports = router;
