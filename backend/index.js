const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const path = require('path');
const app = express();

app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true
    })
);
app.use(cookieParser());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

require('./config/database')

app.use('/api/auth', require('./routes/authentication/authRoutes'));
app.use('/api/landing', require('./routes/landing-page/landingRoutes'));
app.use('/api/categories', require('./routes/categories/categories'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
