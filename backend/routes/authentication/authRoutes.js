const router = require('express').Router();
const AuthController = require('../../controllers/AuthController');

// Auth Routes
module.exports = io => {

  io.on('connection', socket => {
    socket.on('removeloggeduser', data => {
        AuthController.removeLoggedInUser(data);
    });
  });

  router.post('/register', AuthController.registerUser);
  router.post('/login', AuthController.loginUser);
  router.post('/logout', AuthController.logout);
  router.post('/refresh_token', AuthController.refreshToken);

  router.patch('/forgotpassword', AuthController.forgotPassword);
  router.patch('/resetpassword', AuthController.resetPassword);

  return router;
};
