const router = require('express').Router();
const AuthController = require('../../controllers/AuthController');

// Auth Routes
router.post('/register', AuthController.registerUser);
router.post('/login', AuthController.loginUser);
router.post('/logout', AuthController.logout);
router.post('/refresh_token', AuthController.refreshToken);

router.patch("/forgotpassword", AuthController.forgotPassword);
router.patch("/resetpassword", AuthController.resetPassword);

router.patch("/forgotpassword", AuthController.forgotPassword);
router.patch("/resetpassword", AuthController.resetPassword);

module.exports = router;
