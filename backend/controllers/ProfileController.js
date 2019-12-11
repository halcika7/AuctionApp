const BaseController = require('./BaseController');
const ProfileService = require('../services/ProfileService');
const BidService = require('../services/BidService');
const ProductService = require('../services/ProductService');
const stripe = require('stripe')('sk_test_B4Tn8un5MCv2LSkhlJ2ls4Qk');

class ProfileController extends BaseController {
  constructor() {
    super(ProfileController);
  }

  async getUserInfo(req, res) {
    const { userId, accessToken } = req;
    const { userInfo, status, message } = await ProfileService.fetchUserInfo(userId);
    return super.sendResponseWithMessage(res, status, { userInfo, accessToken }, message);
  }

  async getUserProducts(req, res) {
    const { userId, accessToken } = req;
    const { products, noMore, status, message } = await ProductService.fetchUserProducts(
      req.query.data,
      userId
    );
    return super.sendResponseWithMessage(res, status, { products, noMore, accessToken }, message);
  }

  async getUserBids(req, res) {
    const { userId, accessToken } = req;
    const { offset } = JSON.parse(req.query.data);
    const { bids, noMore, status, message } = await BidService.getUserBids(userId, offset);
    return super.sendResponseWithMessage(res, status, { bids, noMore, accessToken }, message);
  }

  async updateProfileInfo(req, res) {
    const { userId, email, accessToken } = req;
    const { status, success, errors, message, userInfoData } = await ProfileService.updateUserInfo(
      req.file,
      req.body,
      userId,
      email
    );
    return super.sendResponseWithMessage(
      res,
      status,
      { errors, message: success, accessToken, userInfo: userInfoData },
      message
    );
  }

  async deactivateAccount(req, res) {
    const { userId } = req;
    const { status, message } = await ProfileService.deactivateUserAccount(userId);
    return super.sendResponseWithMessage(res, status, {}, message);
  }

  async createCardToken(req, res) {
    try {
      const cardToken = await stripe.tokens.create(
        {
          card: {
            name: 'Haris Beslic',
            number: '4242424242424242',
            exp_month: '02',
            exp_year: '2020',
            cvc: 111
          },
        }
      );
      // const cardToken = await stripe.charges.create(
      //   {
      //     amount: 2000,
      //     currency: 'usd',
      //     source: 'tok_1FoKlmIsHl6jkvPYgAlCKLmT',
      //     description: 'Charge for jenny.rosen@example.com',
      //   });
      return res.json({cardToken});
    } catch (error) {
      return res.json({error});
    }
  }
}

const ProfileControllerInstance = new ProfileController();

module.exports = ProfileControllerInstance;
