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
const BaseService = require('./BaseService');
const { createAccessToken, createRefreshToken } = require('../helpers/authHelper');

class PassportService extends BaseService {
  constructor() {
    super(PassportService);
  }

  socialCallback(req, res, provider) {
    return passport.authenticate(
      provider,
      { session: false, failureRedirect: '/' },
      (err, user, info) => this.passportCallback(err, user, info, res)
    )(req, res, provider);
  }

  async passportStrategy(req, profile, done, { googleId = false, facebookId = false }) {
    let updateObject = {};
    const whereObj = { where: { email: profile._json.email } };
    const findUserWithEmail = await User.findOne({ raw: true, ...whereObj });

    if (googleId) {
      whereObj.where.googleId = profile.id;
      updateObject.googleId = profile.id;
    } else if (facebookId) {
      whereObj.where.facebookId = profile.id;
      updateObject.facebookId = profile.id;
    }

    const findUserWithEmailSocialId = await User.findOne({ raw: true, ...whereObj });

    if (
      (findUserWithEmailSocialId && findUserWithEmailSocialId.deactivated) ||
      (findUserWithEmail && findUserWithEmail.deactivated)
    ) {
      return done(new Error('User blocked!'));
    } else if (!findUserWithEmail) {
      const { id, cardInfoId } = await AuthService.createUserData(req, profile._json.email);

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
    } else if (!findUserWithEmailSocialId) {
      await User.update({ ...updateObject }, { where: { id: findUserWithEmail.id } });

      const user = await User.findOne({ raw: true, where: { id: findUserWithEmail.id } });

      return done(null, user);
    }

    return done(null, findUserWithEmailSocialId);
  }

  async passportCallback(err, user, info, res) {
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
      PassportServiceInstance.passportStrategy(req, profile, done, {
        googleId: true
      })
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
      PassportServiceInstance.passportStrategy(req, profile, done, {
        facebookId: true
      })
  )
);

module.exports = { passport, PassportService: PassportServiceInstance };
