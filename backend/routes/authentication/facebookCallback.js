const router = require('express').Router();
const AuthController = require('../../controllers/AuthController');
const { passport } = require('../../services/PassportService');

router.get(
  '/api/auth/facebook',
  passport.authenticate('facebook', {
    scope: 'email'
  })
);

router.get('/cdn-cgi/access/callback', (req, res) =>
  AuthController.socialLogin(req, res, 'facebook')
);

module.exports = router;
