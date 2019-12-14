const fs = require('fs');
const multer = require('multer');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let directory = `./backend/images/`;
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    let fileName = `user-${req.userId}.${file.mimetype.slice(6)}`;
    cb(null, fileName);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const multerConfiguration = multer({
  storage: fileStorage,
  fileFilter
});

module.exports = multerConfiguration;
