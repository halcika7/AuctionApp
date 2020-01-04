const passport = require('passport');
const { Strategy: GoolgeStrategy } = require('passport-google-oauth20');
const { Strategy: FacebookStrategy } = require('passport-facebook');
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK,
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
  FACEBOOK_CALLBACK,
  URL
} = require('../config/configs');
const User = require('../models/User');
const AuthService = require('./AuthService');
const StripeService = require('./StripeService');
const OptionalInfoService = require('./OptionalInfoService');
const CardInfoService = require('./CardInfoService');
const BaseService = require('./BaseService');
const { createAccessToken, createRefreshToken } = require('../helpers/authHelper');

class PassportService extends BaseService {
  constructor() {
    super(PassportService);
  }

  async googleStartegy(req, token, tokenSecret, profile, done) {
    return this.passportAuthenticationHelper(req, profile, done, { googleId: true });
  }

  async facebookStrategy(req, token, tokenSecret, profile, done) {
    return this.passportAuthenticationHelper(req, profile, done, { facebookId: true });
  }

  socialCallback(req, res, provider) {
    return passport.authenticate(
      provider,
      { session: false, failureRedirect: '/' },
      (err, user, info) => this.callbackHelper(err, user, info, res)
    )(req, res);
  }

  async passportAuthenticationHelper(req, profile, done, { googleId = false, facebookId = false }) {
    const whereObj = { where: { email: profile._json.email } };
    const findUserWithEmail = await User.findOne({ raw: true, ...whereObj });

    if (googleId) {
      whereObj.where.googleId = profile.id;
    } else if (facebookId) {
      whereObj.where.facebookId = profile.id;
    }

    const findUserWithEmailAndGoogleId = await User.findOne({ raw: true, ...whereObj });

    if (
      (findUserWithEmailAndGoogleId && findUserWithEmailAndGoogleId.deactivated) ||
      (findUserWithEmail && findUserWithEmail.deactivated)
    ) {

      return done(new Error('User blocked!'));
    } else if (!findUserWithEmail) {

      const { id } = await OptionalInfoService.create();

      const { id: customerId } = await StripeService.createCustomer(
        'Customer for atlant auction app',
        profile._json.email
      );

      const account = await StripeService.createAccount(req, profile._json.email);

      const { id: cardInfoId } = await CardInfoService.createCardInfo(customerId, account.id);

      const socialIds = {
        googleId: googleId ? profile.id : null,
        facebookId: facebookId ? profile.id : null
      };

      const user = await User.create({
        email: profile._json.email,
        firstName: googleId ? profile._json.given_name : profile._json.first_name,
        lastName: googleId ? profile._json.family_name : profile._json.last_name,
        photo: googleId ? profile._json.picture : profile._json.picture.data.url,
        roleId: 1,
        ...socialIds,
        optionalInfoId: id,
        cardInfoId
      });

      return done(null, user);
    } else if (!findUserWithEmailAndGoogleId) {

      let updateObject = {};

      if (googleId) {
        updateObject.googleId = profile.id;
      } else if (facebookId) {
        updateObject.facebookId = profile.id;
      }

      await User.update({ ...updateObject }, { where: { id: findUserWithEmail.id } });

      const user = await User.findOne({ raw: true, where: { id: findUserWithEmail.id } });
      
      return done(null, user);
    }
    return done(null, findUserWithEmailAndGoogleId);
  }

  async callbackHelper(err, user, info, res) {
    try {
      if (err) return res.redirect(`${URL}/home/auth/login?err=${err}`);

      const accessToken = createAccessToken(user),
        refreshToken = createRefreshToken(user);

      AuthService.setRefreshTokenCookie(res, refreshToken);

      return res.redirect(
        `${URL}/home/auth/login?token=${accessToken}&message=${"You're successfully logged in"}&remember=${true}`
      );
    } catch (error) {
      return res.redirect(
        `${URL}/home/auth/login?err=${'Something happened. We were unable to perform request.'}`
      );
    }
  }
}

const PassportServiceInstance = new PassportService();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findOne({ raw: true, where: { id } });
  done(null, user);
});

passport.use(
  new GoolgeStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK,
      passReqToCallback: true
    },
    (req, token, tokenSecret, profile, done) =>
      PassportServiceInstance.googleStartegy(req, token, tokenSecret, profile, done)
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_CLIENT_ID,
      clientSecret: FACEBOOK_CLIENT_SECRET,
      callbackURL: FACEBOOK_CALLBACK,
      profileFields: ['id', 'displayName', 'photos', 'email', 'gender', 'name'],
      passReqToCallback: true
    },
    (req, token, tokenSecret, profile, done) =>
      PassportServiceInstance.facebookStrategy(req, token, tokenSecret, profile, done)
  )
);

module.exports = { passport, PassportService: PassportServiceInstance };
