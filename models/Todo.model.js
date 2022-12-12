const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
  title: String,
  status: Boolean,
  tag: [String],
  userID: String,
});
const TodoModel = mongoose.model("todo", todoSchema);

module.exports = {
  TodoModel,
};
