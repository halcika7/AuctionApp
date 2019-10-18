const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const db = require('./config/database');
const User = require('./model/User');

db.authenticate()
    .then(() => console.log('DB connected'))
    .catch(err => console.log(err));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.get('/api', async (req, res) => {
    const users = await User.findAll();
    return res.status(201).json({ users, message: 'successfull' });
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
