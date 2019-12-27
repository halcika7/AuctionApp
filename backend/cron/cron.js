const CronJob = require('cron').CronJob;
const Product = require('../models/Product');
const Bid = require('../models/Bid');
const User = require('../models/User');
const { notifyAuctionEnd } = require('../helpers/sendEmail');

module.exports = io => {
  io.on('connection', socket => {
    new CronJob(
      '0 0 0 * * *',
      async () => {
        try {
          const date = new Date();
          date.setHours(25, 0, 0, 0);
          console.log('TCL: date', date);

          const products = await Product.findAll({
            raw: true,
            where: { auctionEnd: date },
            attributes: ['id', 'subcategoryId', 'name', 'userId']
          });

          localDate();

          console.log('TCL: products', products.length);

          const productIds = products.map(product => product.id);

          await productIds.map(async id => {
            const bid = await Bid.findOne({
              raw: true,
              where: { productId: id },
              attributes: ['price', 'productId', 'userId'],
              order: [['price', 'DESC']],
              limit: 1
            });

            if (bid) {
              const { subcategoryId, name, userId } = products.find(
                product => product.id === bid.productId
              );

              const user = await User.findOne({ raw: true, where: { id: bid.userId } });
              const owner = await User.findOne({ raw: true, where: { id: userId } });

              socket.emit('auction-ended', {
                productId: id,
                userId: bid.userId,
                name
              });

              // await sendEmail(
              //   user.email,
              //   id,
              //   subcategoryId,
              //   `Congratulations youre bid was highest for ${name}`
              // );

              // await sendEmail(
              //   owner.email,
              //   id,
              //   subcategoryId,
              //   `Auction ended and highest bid for ${name} was ${bid.price}`
              // );
            } else {
              const { subcategoryId, name, userId } = products.find(product => product.id === id);
              const owner = await User.findOne({ raw: true, where: { id: userId } });

              socket.emit('auction-ended', { productId: id });

              // await sendEmail(
              //   owner.email,
              //   id,
              //   subcategoryId,
              //   `Auction ended for ${name} without any bid`
              // );
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
  return true;
};

function localDate() {
  console.log('TCL: localDate -> new Date()', new Date());
}

async function sendEmail(email, productId, subcategoryId, text) {
  await notifyAuctionEnd(email, productId, subcategoryId, text);
}
