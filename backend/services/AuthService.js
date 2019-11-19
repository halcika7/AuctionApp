const {
  registerValidation,
  loginValidation,
  resetPasswordValidation
} = require("../validations/authValidation");
const {
  createAccessToken,
  createRefreshToken,
  createUser,
  findUserByEmail,
  verifyRefreshToken,
  hashPassword
} = require("../helpers/authHelper");
const { sendEmail } = require("../helpers/sendEmail");
const BaseService = require("./BaseService");
const User = require("../models/User");

class AuthService extends BaseService {
  constructor() {
    super(AuthService);
  }

  async register(data) {
    try {
      const { errors, isValid } = await registerValidation(data);
      if (!isValid) return { status: 403, response: { ...errors } };
      await createUser(data);
      return {
        status: 200,
        response: { message: "Account successfully created !" }
      };
    } catch (error) {
      return {
        status: 403,
        response: {
          err: "Something happened. We were unable to create an account."
        }
      };
    }
  }

  async login(data) {
    try {
      const { errors, errorMessage, isValid, user } = await loginValidation(data);
      if (!isValid && errors) return { status: 403, response: { ...errors } };
      if (!isValid && errorMessage) return { status: 403, response: { err: errorMessage } };
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
      console.log("TCL: AuthService -> login -> error", error);
      return {
        status: 403,
        response: {
          err: "Something happened. We were unable to perform login."
        }
      };
    }
  }

  async refreshToken(token) {
    try {
      const payload = verifyRefreshToken(token),
        user = await findUserByEmail(payload.email, false);
      if (!user) {
        return { status: 400, response: { accessToken: "" } };
      }
      return {
        status: 200,
        response: { accessToken: createAccessToken(user) },
        refreshToken: createRefreshToken(user)
      };
    } catch (error) {
      return { status: 400, response: { accessToken: "" } };
    }
  }

  async forgotPassword(email) {
    try {
      if (!email) {
        return { status: 403, response: { errors: { email: "Email is required" } } };
      }
      const user = await findUserByEmail(email);
      if (!user) {
        return {
          status: 403,
          response: { errors: { email: "User not found with provided email" } }
        };
      }
      const resetPasswordToken = createAccessToken(user, "1d");
      const { err } = sendEmail(
        email,
        resetPasswordToken,
        "Need to reset your password? Just click the link below and you'll be on your way. If you did not make this request, please ignore this email."
      );
      if (err) {
        return { status: 403, response: { err: "Something happend" } };
      }
      await User.update({ resetPasswordToken }, { where: { email } });

      return {
        status: 200,
        response: {
          message: "Successfull forgot password request. Please visit your email !"
        }
      };
    } catch (error) {
      return { status: 403, response: { err: "Something happend" } };
    }
  }

  async resetPassword({ resetPasswordToken, password }) {
    try {
      const { errors, errorMessage, isValid, email } = await resetPasswordValidation(
        resetPasswordToken,
        password
      );
      if (!isValid && errors) return { status: 403, response: { ...errors } };
      if (!isValid && errorMessage) return { status: 403, response: { err: errorMessage } };
      const hashedPassword = await hashPassword(password);
      await User.update(
        { resetPasswordToken: null, password: hashedPassword },
        { where: { email } }
      );
      return {
        status: 200,
        response: {
          message: "Password updated!"
        }
      };
    } catch (error) {
      return {
        status: 403,
        response: {
          err: "Something happened. We were unable to perform request."
        }
      };
    }
  }

  setRefreshTokenCookie(res, token) {
    return res.cookie("jid", token, { httpOnly: true });
  }
}

const AuthServiceInstance = new AuthService();

module.exports = AuthServiceInstance;
