const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const uploadFilter = function (req, file, cb) {
    let ext = path.extname(file.originalname);
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== ".png") {
        cb(new Error('File type is not supported'));
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: uploadFilter
});

module.exports = { upload }