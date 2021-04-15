const expressBootstrap = require("./express.bootstrap");
const mongooseBootstrap = require("./mongoose.bootstrap");
const multerBootstrap = require("./multer.bootstrap");
const socketIoBootstrap = require("./socket.io.bootstrap");

const bootStrap = async () => {
  await mongooseBootstrap.init();
  await multerBootstrap.init();
  await expressBootstrap.init();
  await socketIoBootstrap.init({ httpServer: expressBootstrap.httpServer });
};

module.exports = bootStrap;
