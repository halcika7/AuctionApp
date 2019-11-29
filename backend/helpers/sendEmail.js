const { SEND_GRID } = require('../config/configs');
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
        token
      })
    });
    return { err: null };
  } catch (err) {
    return { err: err.message || err };
  }
};
