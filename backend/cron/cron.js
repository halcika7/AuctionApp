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
          date.setHours(2, 0, 0, 0);

          const products = await Product.findAll({
            raw: true,
            where: { auctionEnd: date },
            attributes: ['id', 'subcategoryId', 'name', 'userId']
          });
          console.log('TCL: products', products)

        //   const productIds = products.map(product => product.id);

        //   const promises = await productIds.map(async id => {
        //     let i = 0;
        //     const bid = await Bid.findOne({
        //       raw: true,
        //       where: { productId: id },
        //       attributes: ['price', 'productId', 'userId'],
        //       order: [['price', 'DESC']],
        //       limit: 1
        //     });
        //     if (bid) {
        //       const { subcategoryId, name, userId } = products.find(
        //         product => product.id === bid.productId
        //       );

        //       const user = await User.findOne({
        //         raw: true,
        //         where: { id: bid.userId }
        //       });

        //       const owner = await User.findOne({
        //         raw: true,
        //         where: { id: userId }
        //       });

        //       await notifyAuctionEnd(
        //         user.email,
        //         id,
        //         subcategoryId,
        //         `Congratulations youre bid was highest for ${name}`
        //       );

        //       await notifyAuctionEnd(
        //         owner.email,
        //         id,
        //         subcategoryId,
        //         `Auction ended and highest bid for ${name} was ${bid.price}`
        //       );

        //       console.log('fired');
        //     } else {
        //       const { subcategoryId, name, userId } = products.find(product => product.id === id);

        //       const owner = await User.findOne({
        //         raw: true,
        //         where: { id: userId }
        //       });

        //       await notifyAuctionEnd(
        //         owner.email,
        //         id,
        //         subcategoryId,
        //         `Auction ended for ${name} without any bid`
        //       );

        //       console.log(i);
        //       i++;
        //     }
        //   });
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
