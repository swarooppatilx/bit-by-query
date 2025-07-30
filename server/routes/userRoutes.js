const express = require("express");
const { getUserInfo } = require("../controllers/userController");
const authenticateToken = require("../middleware/authenticateToken");
const router = express.Router();

router.get("/userinfo", authenticateToken, getUserInfo);

module.exports = router;
