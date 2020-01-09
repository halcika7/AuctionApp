const BaseService = require('./BaseService');
const Review = require('../models/Review');
const { db, Op } = require('../config/database');

class ReviewService extends BaseService {
  constructor() {
    super(ReviewService);
  }

  async addOrUpdateReview(rating, userId, ownerId) {
    try {
      if (!rating) return super.returnResponse(200, {});
      const findIfReviewExists = await Review.findOne({
        raw: true,
        where: { userId, ownerId }
      });

      if (!findIfReviewExists) {
        await Review.create({
          userId,
          ownerId,
          rating
        });
      } else {
        await Review.update({ rating }, { where: { id: findIfReviewExists.id } });
      }
      return super.returnResponse(200, {});
    } catch (error) {
      return super.returnGenericFailed();
    }
  }

  async findReview(userId, ownerId) {
    return await Review.findOne({
      raw: true,
      where: { userId, ownerId },
      attributes: ['rating']
    });
  }
}

const ReviewServiceInstance = new ReviewService();

module.exports = ReviewServiceInstance;
