const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const path = require('path');
const app = express();
const { URL } = require('./config/configs');

app.use(
    cors({
        origin: URL,
        credentials: true
    })
);
app.use(cookieParser());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

require('./config/database');

app.use('/api/auth', require('./routes/authentication/authRoutes'));
app.use('/api/landing', require('./routes/landing-page/landingRoutes'));
app.use('/api/categories', require('./routes/categories/categories'));
app.use('/api/products', require('./routes/product/product'));

// static assets for production
if(process.env.NODE_ENV === 'production') {
    //Set static folder
    app.use(express.static('frontend'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'index.html'));
    });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
