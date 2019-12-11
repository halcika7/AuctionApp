const { TWILIO_SID, TWILIO_AUTH_TOKEN } = require('./configs');
const client =require('twilio')(TWILIO_SID, TWILIO_AUTH_TOKEN);

module.exports = { client };
