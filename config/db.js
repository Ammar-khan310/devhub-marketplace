const mongoose = require("mongoose");

async function connectMongoDb() {
  return mongoose.connect(process.env.MONGO_URI);
}

module.exports = connectMongoDb;
