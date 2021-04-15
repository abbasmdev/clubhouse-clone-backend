const path = require("path");
const uploadsBaseDir = path.join(__dirname, "../../../", "public", "uploads");
const profileImagesBaseDir = path.join(uploadsBaseDir, "profile-images");

const multerConfig = {
  uploadsBaseDir: uploadsBaseDir,
  profileImagesBaseDir: profileImagesBaseDir,
};

module.exports = multerConfig;
