const router = require('express').Router();
const AuthController = require('../../controllers/AuthController');
const authMiddleware = require('../../middlewares/authMiddleware');

// Auth Routes
router.post('/register', new AuthController().registerUser);
router.post('/login', new AuthController().loginUser);
router.post('/logout', authMiddleware, new AuthController().logout);

module.exports = router;
