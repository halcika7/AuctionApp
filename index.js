const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const path = require('path');
const app = express();
const port = process.env.PORT || 4000;
const fs = require('fs');
const http = require('http');
const httpServer = http.createServer();
const https = require('https');
const secureServer = https.createServer(
  {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
  },
  app
);

const io = require('socket.io')(httpServer);
const { URL } = require('./backend/config/configs');
const { passport } = require('./backend/services/PassportService')

app.use(
  cors({
    origin: URL,
    credentials: true
  })
);
app.use(cookieParser());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

require('./backend/config/database');
require('./backend/models/Associations');

app.use('/api/auth', require('./backend/routes/authentication/authRoutes')(io));
app.use('/api/landing', require('./backend/routes/landing-page/landingRoutes'));
app.use('/api/categories', require('./backend/routes/categories/categories'));
app.use('/api/products', require('./backend/routes/product/product'));
app.use('/api/bids', require('./backend/routes/bid/bid')(io));
app.use('/api/shop', require('./backend/routes/shop/shop'));
app.use('/api/profile', require('./backend/routes/profile/profile'));
app.use('/api/add-product', require('./backend/routes/product/add-product'));
app.use('/api/wishlist', require('./backend/routes/wishlist/wishlist'));
app.use('/api/notifications', require('./backend/routes/notifications/notifications')(io));
app.use('/api/payment', require('./backend/routes/payment/payment'));

require('./backend/cron/cron')(io);

// static assets for production
if (process.env.NODE_ENV === 'production') {
  //Set static folder
  app.use(express.static('./backend/frontend'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './backend/frontend', 'index.html'));
  });
}

secureServer.listen(port, () => console.log(`Server running on port ${port}`));
