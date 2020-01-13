const CronJob = require('cron').CronJob;
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
          const { products, productIds } = await getProducts();

          await productIds.map(async productId => {
            const bid = await getHighestBid(productId);

            if (bid) {
              const { userId, productId: bidProductId } = bid;
              const { name } = getProductData(products, bidProductId);

              socket.emit('auction-ended', { productId, userId, name });
            } else {
              socket.emit('auction-ended', { productId });
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

  new CronJob(
    '00 00 23 * * *',
    async () => {
      try {
        const { productIds, products } = await getProducts();

        await WishlistService.removeFromWishlistByProductId(productIds);

        await productIds.map(async id => {
          const bid = await getHighestBid(id);

          if (bid) {
            const { subcategoryId, name, userId } = getProductData(products, bid.productId);
            const user = await getUser(bid.userId);
            const owner = await getUser(userId);

            await sendEmail(
              user.email,
              id,
              subcategoryId,
              `Congratulations your bid was highest for ${name}`,
              false
            );

            await sendEmail(
              owner.email,
              id,
              subcategoryId,
              `Auction ended and highest bid for ${name} was ${bid.price}`
            );
          } else {
            const { subcategoryId, name, userId } = getProductData(products, id);
            const { email } = await getUser(userId);

            await sendEmail(email, id, subcategoryId, `Auction ended for ${name} without any bid`);
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
};

async function sendEmail(email, productId, subcategoryId, text, owner = true) {
  return await notifyAuctionEnd(email, productId, subcategoryId, text, owner);
}

async function getProducts() {
  const date = new Date();
  date.setHours(23, 0, 0, 0);

  const products = await findProductsByAuctionEnd(date);
  const productIds = products.map(product => product.id);

  return { products, productIds };
}

async function getHighestBid(id) {
  return await BidService.getHighestBid(id);
}

async function getUser(id) {
  return await findUserById(id);
}

function getProductData(products, idToFind) {
  return products.find(product => product.id === idToFind);
}
