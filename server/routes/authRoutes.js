const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

router.post('/register', authController.register);
router.post('/login', authController.login);

// ✅ Add this route using existing authController
router.get('/profile', verifyToken, authController.getProfile);

module.exports = router;
