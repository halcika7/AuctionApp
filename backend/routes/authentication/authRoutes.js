const router = require('express').Router();
const AuthController = require('../../controllers/AuthController');
const authMiddleware = require('../../middlewares/authMiddleware');

// Auth Routes
router.post('/register', AuthController.registerUser);
router.post('/login', AuthController.loginUser);
router.post('/logout', AuthController.logout);
router.post('/refresh_token', AuthController.refreshToken);

module.exports = router;
