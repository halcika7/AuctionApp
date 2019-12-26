const { SEND_GRID, URL } = require('../config/configs');
const path = require('path');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const transporter = nodemailer.createTransport(sendgridTransport({ auth: { api_key: SEND_GRID } }));
const pug = require('pug');

exports.sendEmail = async (email, token, text) => {
  try {
    let reqPath = path.join(__dirname, '../');

    await transporter.sendMail({
      from: 'auctionapp@example.com',
      to: email,
      subject: 'Reset password',
      html: pug.renderFile(reqPath + 'emails/forgotPassword.pug', {
        text,
        token,
        URL
      })
    });

    return { err: null };
  } catch (err) {
    return { err: err.message || err };
  }
};

exports.notifyAuctionEnd = async (email, productId, subcategoryId, text) => {
  try {
    let reqPath = path.join(__dirname, '../');

    await transporter.sendMail({
      from: 'auctionapp@example.com',
      to: email,
      subject: 'Auction end',
      html: pug.renderFile(reqPath + 'emails/auctionEnd.pug', {
        text,
        URL: URL + `/shop/products/${subcategoryId}/${productId}`
      })
    });

    return { err: null };
  } catch (err) {
    return { err: err.message || err };
  }
};
