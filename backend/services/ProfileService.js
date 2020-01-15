const BaseService = require('./BaseService');
const User = require('../models/User');
const Product = require('../models/Product');
const Bid = require('../models/Bid');
const Order = require('../models/Order');
const ProductImage = require('../models/ProductImage');
const Wishlist = require('../models/Wishlist');
const FilterValueProduct = require('../models/FilterValueProduct');
const ProductReview = require('../models/ProductReview');
const CardInfoService = require('../services/CardInfoService');
const OptionalInfoService = require('../services/OptionalInfoService');
const CloudinaryService = require('../services/CloudinaryService');
const {
  removeNullFromUserInfo,
  removeNullFromOptionalUserInfo,
  removeNullFromUserCardInfo
} = require('../helpers/removeNullProperty');
const { userInfoValidation, userCardValidation } = require('../validations/updateUsersProfile');
const {
  getUserInfo,
  createAccessToken,
  createRefreshToken,
  getOptionalInfoCard,
  productOwnerInfo,
  getUsersOptionalInfoIdAndCardInfoId
} = require('../helpers/authHelper');
const { unlinkFiles } = require('../helpers/unlinkFiles');
const { db, Op } = require('../config/database');

class ProfileService extends BaseService {
  constructor() {
    super(ProfileService);
  }

  async fetchUserInfo(id) {
    try {
      const userInfo = await getUserInfo(id);

      return super.returnResponse(200, { userInfo });
    } catch (error) {
      return super.returnGenericFailed();
    }
  }

  async deactivateUserAccount(id) {
    try {
      await User.update({ deactivated: true }, { where: { id } });

      const { ids: productsWithUserBids } = await Product.findOne({
        subQuery: false,
        raw: true,
        where: { auctionEnd: { [Op.gt]: new Date() } },
        include: {
          model: Bid,
          where: { userId: id },
          attributes: []
        },
        attributes: [[db.fn('ARRAY_AGG', db.col('Product.id')), 'ids']]
      });

      if (productsWithUserBids) {
        await Bid.destroy({
          where: { productId: { [Op.in]: productsWithUserBids }, userId: id }
        });
      }

      const { ids = [], orderIds = [], imagesUrls = [] } = await Product.findOne({
        raw: true,
        where: { userId: id, auctionEnd: { [Op.gt]: new Date() } },
        attributes: [
          [db.fn('ARRAY_AGG', db.col('id')), 'ids'],
          [db.fn('ARRAY_AGG', db.col('orderId')), 'orderIds'],
          [db.fn('ARRAY_AGG', db.col('picture')), 'imagesUrls']
        ]
      });

      if (ids && ids.length > 0) {
        const { images = [] } = await ProductImage.findOne({
          raw: true,
          where: {
            productId: {
              [Op.in]: ids
            }
          },
          attributes: [[db.fn('ARRAY_AGG', db.col('image')), 'images']]
        });

        const allProductImages = imagesUrls.concat(images);

        await allProductImages.map(async val => {
          try {
            const splitedPhoto = val.split('/');
            if (splitedPhoto && splitedPhoto.length > 0) {
              const public_id = splitedPhoto[splitedPhoto.length - 1].split('.')[0];
              await CloudinaryService.deleteImage(public_id);
            }
          } catch (error) {
            console.log('TCL: ProfileService -> deactivateUserAccounttttt -> error', error);
          }
        });

        await Bid.destroy({ where: { productId: { [Op.in]: ids } } });

        await FilterValueProduct.destroy({ where: { productId: { [Op.in]: ids } } });

        await ProductReview.destroy({ where: { productId: { [Op.in]: ids } } });

        await ProductImage.destroy({ where: { productId: { [Op.in]: ids } } });

        await Product.destroy({ where: { id: { [Op.in]: ids } } });

        await Order.destroy({ where: { id: { [Op.in]: orderIds } } });

        await Wishlist.destroy({ where: { productId: { [Op.in]: ids } } });
      }

      return super.returnResponse(200, {});
    } catch (error) {
      return super.returnGenericFailed();
    }
  }

  async updateUserInfo(file, { userInfo, optionalInfo, token, name, changeCard }, userId, email) {
    userInfo = JSON.parse(userInfo);
    optionalInfo = JSON.parse(optionalInfo);

    try {
      //userId, optionalInfoId and cardInfoId are same
      const { errors: requiredInfoErrors, isValid, currentUser } = await userInfoValidation(
        userInfo,
        email
      );

      let { isValid: validCard, errors, cardInfoData } = await userCardValidation(
        token,
        name,
        changeCard,
        userId,
        email,
        requiredInfoErrors,
        isValid
      );

      if (!validCard || !isValid) {
        file && file.path && unlinkFiles([file]);
        return super.returnResponse(403, errors);
      }

      if (file && file.path) {
        const { secure_url } = await CloudinaryService.uploadProfilePhoto(file.path, userId);
        userInfo.photo = secure_url;
        unlinkFiles([file]);
      } else {
        userInfo.photo = currentUser.photo;
      }

      const { optionalInfoId, cardInfoId } = await getUsersOptionalInfoIdAndCardInfoId(userId);

      userInfo = removeNullFromUserInfo(userInfo, currentUser);
      const currentOptionalInfo = await OptionalInfoService.getOptionalInfo(optionalInfoId);
      optionalInfo = removeNullFromOptionalUserInfo(optionalInfo, currentOptionalInfo);

      const currentCardInfo = await CardInfoService.getUserCardInfo(cardInfoId);
      cardInfoData = cardInfoData ? removeNullFromUserCardInfo(currentCardInfo, cardInfoData) : {};

      const [updateOptionalData] = await OptionalInfoService.update(optionalInfo, optionalInfoId);
      const [updatedCardInfoData] = await CardInfoService.updateCardInfo(cardInfoData, cardInfoId);
      const [updateUserInfo] = await User.update({ ...userInfo }, { where: { id: userId } });

      const userInfoData = await getUserInfo(userId);

      const accessToken = createAccessToken(userInfoData),
        refreshToken = createRefreshToken(userInfoData);

      const success =
        updateOptionalData == 0 && updateUserInfo == 0 && updatedCardInfoData == 0
          ? 'No changes to user profile are made'
          : 'Profile info updated';

      return super.returnResponse(200, { success, userInfoData, accessToken, refreshToken });
    } catch (error) {
      return super.returnResponse(403, {
        message: 'Something happened. We were unable to perform request.'
      });
    }
  }

  async userOptionalInfoWithCard(id) {
    try {
      const userInfo = await getOptionalInfoCard(id);

      return super.returnResponse(200, { userInfo });
    } catch (error) {
      return super.returnGenericFailed();
    }
  }

  async getProductOwnerInfo(id) {
    return await productOwnerInfo(id);
  }
}

const ProfileServiceInstance = new ProfileService();

module.exports = ProfileServiceInstance;
