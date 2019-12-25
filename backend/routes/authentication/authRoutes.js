const router = require('express').Router();
const AuthController = require('../../controllers/AuthController');
const logoutMiddleware = require('../../middlewares/logoutMiddleware');

// Auth Routes
router.post('/register', AuthController.registerUser);
router.post('/login', AuthController.loginUser);
router.post('/logout', logoutMiddleware, AuthController.logout);
router.post('/refresh_token', AuthController.refreshToken);

router.patch("/forgotpassword", AuthController.forgotPassword);
router.patch("/resetpassword", AuthController.resetPassword);

module.exports = router;
