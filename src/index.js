require("dotenv").config();
const bootStrap = require("./core/bootstrap");

bootStrap()
  .then(() => {
    console.log(`Bootstrap success..`);
  })
  .catch((e) => {
    console.log(e);
    process.exit(-1);
  });
