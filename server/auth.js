const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/login
router.post('/login', authController.login);

// POST /api/register
router.post('/register', authController.register);

module.exports = router;
