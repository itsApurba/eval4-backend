const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: String,
  password: String,
  ip: String,
});

const UserModel = mongoose.model("user", userSchema);

module.exports = {
  UserModel,
};
