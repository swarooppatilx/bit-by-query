const express = require("express");
const { login, register, logout, status } = require("../controllers/authController");
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout",logout);

module.exports = router;
