const fs = require('fs');

module.exports.unlinkFiles = (files) => {
    files.forEach(file => fs.unlinkSync(file.path));
}