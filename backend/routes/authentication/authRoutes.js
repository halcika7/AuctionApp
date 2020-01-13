const router = require('express').Router();
const AuthController = require('../../controllers/AuthController');
const { passport } = require('../../services/PassportService');

// Auth Routes
module.exports = io => {
  io.on('connection', socket => {
    socket.on('removeloggeduser', data => {
      AuthController.removeLoggedInUser(data);
    });
    router.post('/logout', (req, res) => AuthController.logout(req, res, io));
  });

  router.post('/register', AuthController.registerUser);
  router.post('/login', AuthController.loginUser);
  router.post('/refresh_token', AuthController.refreshToken);

  router.patch('/forgotpassword', AuthController.forgotPassword);
  router.patch('/resetpassword', AuthController.resetPassword);

  router.get(
    '/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      prompt: 'select_account'
    })
  );

  router.get(
    '/facebook',
    passport.authenticate('facebook', {
      scope: 'email',
      authType: 'reauthenticate'
    })
  );

  router.get('/google/callback', (req, res) => AuthController.socialLogin(req, res, 'google'));

  router.get('/facebook/callback', (req, res) => AuthController.socialLogin(req, res, 'facebook'));

  return router;
};
