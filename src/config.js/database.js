const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://yogendra1sk1:8OSeCg9tIA4qE6Ek@file-share.dleeo2l.mongodb.net/devTinder"
  );
};

module.exports = connectDb;
