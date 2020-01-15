const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation
} = require('../validations/authValidation');
const {
  createAccessToken,
  createRefreshToken,
  createUser,
  findUserByEmail,
  verifyRefreshToken,
  verifyAccessToken,
  hashPassword
} = require('../helpers/authHelper');
const { sendEmail, sendActivationEmail } = require('../helpers/sendEmail');
const BaseService = require('./BaseService');
const User = require('../models/User');
const CardInfoService = require('../services/CardInfoService');
const OptionalInfoService = require('../services/OptionalInfoService');
const StripeService = require('../services/StripeService');
const { TOKEN_DURATION } = require('../config/configs');

class AuthService extends BaseService {
  constructor() {
    super(AuthService);
    /**
     * @type Array<{ id: string; email: string }>
     */
    this.loggedInUsers = [];
  }

  async register(data) {
    try {
      const { errors, isValid } = await registerValidation(data);

      if (!isValid) return { status: 403, response: { ...errors } };

      const { id, cardInfoId } = await this.createUserData(data.email);

      const activationToken = createAccessToken({ id: null, email: data.email }, TOKEN_DURATION);

      data.activationToken = activationToken;

      await createUser(data, id, cardInfoId);

      const { err } = await sendActivationEmail(
        data.email,
        `${data.firstName} ${data.lastName}`,
        activationToken
      );

      if (err) return { status: 403, response: { message: err } };

      return super.returnResponse(200, {
        response: {
          message:
            'Account successfully created. Please visit your mail inbox to verify email or use social login !'
        }
      });
    } catch (error) {
      return super.returnResponse(403, {
        response: { message: 'Something happened. We were unable to create an account.' }
      });
    }
  }

  async login(data) {
    try {
      const { errors, message, isValid, user } = await loginValidation(data);

      if (!isValid && errors) return super.returnResponse(403, { response: { ...errors } });

      if (!isValid && message) return super.returnResponse(403, { response: { message } });

      const accessToken = createAccessToken(user, '15m', data.remember),
        refreshToken = createRefreshToken(user);

      this.pushLoggedUser(user);

      return {
        status: 200,
        response: {
          message: "You're successfully logged in",
          accessToken,
          remember: data.remember
        },
        refreshToken
      };
    } catch (error) {
      return super.returnResponse(403, {
        response: { message: 'Something happened. We were unable to perform login.' }
      });
    }
  }

  async refreshToken(token, remember) {
    try {
      const payload = remember ? verifyRefreshToken(token) : verifyAccessToken(token);
      const user = await findUserByEmail(payload.email, false);

      if (!user) {
        return super.returnResponse(400, { response: { accessToken: '' } });
      }

      this.pushLoggedUser(user);

      return {
        status: 200,
        response: { accessToken: createAccessToken(user, '15m', remember) },
        refreshToken: remember ? createRefreshToken(user) : null
      };
    } catch (error) {
      ('TCL: AuthService -> refreshToken -> error', error)
      return super.returnResponse(400, {
        response: { accessToken: '' }
      });
    }
  }

  async forgotPassword(email) {
    try {
      const { errors, isValid, user } = await forgotPasswordValidation(email);

      if (!isValid && errors) return { status: 403, response: { ...errors } };

      const resetPasswordToken = createAccessToken(user, TOKEN_DURATION);
      const { err } = await sendEmail(
        email,
        resetPasswordToken,
        "Need to reset your password? Just click the link below and you'll be on your way. If you did not make this request, please ignore this email."
      );

      if (err) {
        return { status: 403, response: { message: err } };
      }

      await User.update({ resetPasswordToken }, { where: { email } });

      return {
        status: 200,
        response: {
          message:
            'You have successfully requested a password reset. Please check your email for further instructions.'
        }
      };
    } catch (error) {
      return { status: 403, response: { message: 'Something happend' } };
    }
  }

  async resetPassword({ resetPasswordToken, password }) {
    try {
      const { errors, message, isValid, email } = await resetPasswordValidation(
        resetPasswordToken,
        password
      );

      if (!isValid && errors) return { status: 403, response: { ...errors } };

      if (!isValid && message) return { status: 403, response: { message } };

      const hashedPassword = await hashPassword(password);
      await User.update(
        { resetPasswordToken: null, password: hashedPassword },
        { where: { email } }
      );

      return {
        status: 200,
        response: {
          message: 'Password updated!'
        }
      };
    } catch (error) {
      return {
        status: 403,
        response: {
          message: 'Something happened. We were unable to perform request.'
        }
      };
    }
  }

  async createUserData(email) {
    const { id } = await OptionalInfoService.create();
    const { id: customerId } = await StripeService.createCustomer(
      'Customer for atlant auction app',
      email
    );
    const account = await StripeService.createAccount(email);
    const { id: cardInfoId } = await CardInfoService.createCardInfo(customerId, account.id);

    return { id, cardInfoId };
  }

  async activateAccount({ activationToken }) {
    try {
      const user = await User.findOne({ raw: true, where: { activationToken } });
      activationToken = verifyAccessToken(activationToken);

      if (!activationToken) {
        return { status: 403, response: { message: 'Token not provided' } };
      } else if (activationToken.err) {
        return {
          status: 403,
          response: { message: 'Activation token expired, please resend activation link.' }
        };
      } else if (!user) {
        return { status: 403, response: { message: 'Invalid token or account already activated' } };
      }

      await User.update(
        { activationToken: null, deactivated: false },
        { where: { email: user.email } }
      );

      return { status: 200, response: { message: 'Account successfully activated' } };
    } catch (error) {
      return {
        status: 403,
        response: { message: 'Something happened. We were unable to perform request.' }
      };
    }
  }

  async reactivateAccount({ email }) {
    try {
      const user = await User.findOne({ raw: true, where: { email } });

      if (!user) {
        return { status: 403, response: { message: 'Invalid email provided' } };
      } else if (!user.deactivated && !user.activationToken) {
        return { status: 403, response: { message: 'Account already activated' } };
      }

      const activationToken = createAccessToken({ id: null, email }, TOKEN_DURATION);

      await User.update({ activationToken, deactivated: false }, { where: { email } });

      const { err } = await sendActivationEmail(
        email,
        `${user.firstName} ${user.lastName}`,
        activationToken
      );

      if (err) {
        await User.update(
          { activationToken: user.activationToken, deactivated: user.deactivated },
          { where: { email } }
        );
        return {
          status: 403,
          response: { message: 'We were unable to send email. Please try again later.' }
        };
      }

      return {
        status: 200,
        response: { message: 'Please visit your mail inbox to verify email or use social login !' }
      };
    } catch (error) {
      return {
        status: 403,
        response: { message: 'Something happened. We were unable to perform request.' }
      };
    }
  }

  pushLoggedUser({ id, email }) {
    const findIndex = this.loggedInUsers.findIndex(user => user.id === id);
    if (findIndex === -1) {
      this.loggedInUsers.push({ id, email });
    }
  }

  removeLoggedUser(id) {
    if (!id) return;
    const loggedUsers = [...this.loggedInUsers];
    const findIndex = this.loggedInUsers.findIndex(user => user.id === id);

    if (findIndex !== -1) {
      loggedUsers.splice(findIndex, 1);
    }

    this.loggedInUsers = loggedUsers;
  }

  getLoggedUsers() {
    return this.loggedInUsers;
  }

  setRefreshTokenCookie(res, token) {
    return res.cookie('jid', token, { httpOnly: true });
  }
}

const AuthServiceInstance = new AuthService();

module.exports = AuthServiceInstance;
