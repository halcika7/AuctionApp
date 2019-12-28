const CronJob = require('cron').CronJob;
const Bid = require('../models/Bid');
const WishlistService = require('../services/WishlistService');
const BidService = require('../services/BidService');
const { notifyAuctionEnd } = require('../helpers/sendEmail');
const { findUserById } = require('../helpers/authHelper');
const { findProductsByAuctionEnd } = require('../helpers/productFilter');

module.exports = io => {
  io.on('connection', socket => {
    new CronJob(
      '00 00 23 * * *',
      async () => {
        try {
          const date = new Date();
          date.setHours(24, 0, 0, 0);

          const products = await findProductsByAuctionEnd(date);
          const productIds = products.map(product => product.id);

          await WishlistService.removeFromWishlistByProductId(productIds);

          await productIds.map(async id => {
            const bid = await BidService.getHighestBid(id);

            if (bid) {
              const { subcategoryId, name, userId } = products.find(
                product => product.id === bid.productId
              );

              const user = await findUserById(bid.userId);
              const owner = await findUserById(userId);

              socket.emit('auction-ended', {
                productId: id,
                userId: bid.userId,
                name
              });

              await sendEmail(
                user.email,
                id,
                subcategoryId,
                `Congratulations youre bid was highest for ${name}`
              );

              await sendEmail(
                owner.email,
                id,
                subcategoryId,
                `Auction ended and highest bid for ${name} was ${bid.price}`
              );
            } else {
              const { subcategoryId, name, userId } = products.find(product => product.id === id);
              const owner = await findUserById(userId);

              socket.emit('auction-ended', { productId: id });

              await sendEmail(
                owner.email,
                id,
                subcategoryId,
                `Auction ended for ${name} without any bid`
              );
            }
          });
        } catch (error) {
          console.log('TCL: error', error);
        }
      },
      null,
      true,
      'Etc/UTC'
    );
  });
};

async function sendEmail(email, productId, subcategoryId, text) {
  await notifyAuctionEnd(email, productId, subcategoryId, text);
}
