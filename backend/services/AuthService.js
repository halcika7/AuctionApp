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
  hashPassword
} = require('../helpers/authHelper');
const { sendEmail } = require('../helpers/sendEmail');
const BaseService = require('./BaseService');
const User = require('../models/User');
const CardInfoService = require('../services/CardInfoService');
const OptionalInfoService = require('../services/OptionalInfoService');
const StripeService = require('../services/StripeService');

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
      
      await createUser(data, id, cardInfoId);

      return super.returnResponse(200, {
        response: { message: 'Account successfully created !' }
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

      const accessToken = createAccessToken(user),
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

  async refreshToken(token) {
    try {
      const payload = verifyRefreshToken(token),
        user = await findUserByEmail(payload.email, false);

      if (!user) {
        return super.returnResponse(400, { response: { accessToken: '' } });
      }

      this.pushLoggedUser(user);

      return {
        status: 200,
        response: { accessToken: createAccessToken(user) },
        refreshToken: createRefreshToken(user)
      };
    } catch (error) {
      return super.returnResponse(400, {
        response: { accessToken: '' }
      });
    }
  }

  async forgotPassword(email) {
    try {
      const { errors, isValid, user } = await forgotPasswordValidation(email);

      if (!isValid && errors) return { status: 403, response: { ...errors } };

      const resetPasswordToken = createAccessToken(user, '1d');
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

    return { id, cardInfoId }
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
