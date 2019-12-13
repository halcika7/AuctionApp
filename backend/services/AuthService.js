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
  hashPassword,
  createOptionalInfo,
  createCardInfo
} = require('../helpers/authHelper');
const { sendEmail } = require('../helpers/sendEmail');
const BaseService = require('./BaseService');
const User = require('../models/User');

class AuthService extends BaseService {
  constructor() {
    super(AuthService);
  }

  async register(data) {
    try {
      const { errors, isValid } = await registerValidation(data);
      if (!isValid) return { status: 403, response: { ...errors } };
      const { id } = await createOptionalInfo();
      const { id:cardInfoId } = await createCardInfo();
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

  setRefreshTokenCookie(res, token) {
    return res.cookie('jid', token, { httpOnly: true });
  }
}

const AuthServiceInstance = new AuthService();

module.exports = AuthServiceInstance;
