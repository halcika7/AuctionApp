const router = require('express').Router();
const AuthController = require('../../controllers/AuthController');

router.get('/cdn-cgi/access/callback', (req, res) =>
  AuthController.socialLogin(req, res, 'facebook')
);

module.exports = router;
