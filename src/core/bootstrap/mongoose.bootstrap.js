const mongoose = require("mongoose");

class MongooseBootstrap {
  async init() {
    const uri = process.env.MONGO_URI;
    await mongoose.connect(uri, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Mongoose connected.`);
  }
}

const mongooseBootstrap = new MongooseBootstrap();
module.exports = mongooseBootstrap;
