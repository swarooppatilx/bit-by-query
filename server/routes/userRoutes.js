const express = require("express");
const { getUserInfo } = require("../controllers/userController");
const authenticateToken = require("../middleware/authenticateToken");
const { apiRateLimiter } = require("../middleware/rateLimiting");
const router = express.Router();

router.get("/userinfo", authenticateToken, apiRateLimiter, getUserInfo);

module.exports = router;