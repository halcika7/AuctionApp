const router = require('express').Router();
const AuthController = require('../../controllers/AuthController');
const authMiddleware = require('../../middlewares/authMiddleware');

// Auth Routes
router.post('/register', AuthController.registerUser);
router.post('/login', AuthController.loginUser);
router.post('/logout', authMiddleware, AuthController.logout);

module.exports = router;
