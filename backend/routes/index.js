const express = require('express');
const router = express.Router();

const authController = require('../controller/auth')

//auth router
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/verifyToken', authController.verifyEmail);

module.exports = router;
