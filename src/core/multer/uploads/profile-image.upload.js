const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const multerConfig = require("../multer-config");
const HttpBadReuestException = require("../../exceptions/http-badrequest-exception");
const baseDir = multerConfig.profileImagesBaseDir;
const profileImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, baseDir);
  },
  filename: function (req, file, cb) {
    const ext = path?.extname(file?.originalname);
    if (ext) {
      cb(null, uuidv4() + ext);
    } else {
      cb(new Error("getting filename failed."));
    }
  },
});

const profileImageUpload = multer({
  storage: profileImageStorage,
  fileFilter: function (req, file, callback) {
    const ext = path?.extname(file?.originalname)?.toLocaleLowerCase();
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      return callback(
        new HttpBadReuestException({ message: "Only images are allowed" })
      );
    }
    callback(null, true);
  },
  limits: {
    fileSize: Number(process.env.PROFILE_IMAGE_SIZE_BYTES || 1),
  },
});

module.exports = profileImageUpload;
