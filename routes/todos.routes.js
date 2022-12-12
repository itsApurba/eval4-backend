const express = require("express");

const { TodoModel } = require("../models/Todo.model");

todoRouter = express.Router();

todoRouter.get("/", async (req, res) => {
  const todos = await TodoModel.find();
  res.send(todos);
});

todoRouter.post("/create", async (req, res) => {
  const payload = req.body;

  try {
    const newTodo = new TodoModel(payload);
    await newTodo.save();
    res.send({ msg: "Todo Created" });
  } catch (error) {
    console.log(error);
    res.send("something bad happened");
  }
});

todoRouter.patch("/update/:id", async (req, res) => {
  const id = req.params.id;
  const userID = req.body.userID;
  const todo = await TodoModel.findOne({ _id: id });
  if (userID !== todo.userID) {
    res.send("Not Accessable");
  } else {
    await TodoModel.findByIdAndUpdate({ _id: id }, payload);
    res.send({ msg: "Done" });
  }
});
todoRouter.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const userID = req.body.userID;
  const todo = await TodoModel.findOne({ _id: id });
  if (userID !== todo.userID) {
    res.send("Not Accessable");
  } else {
    await TodoModel.findByIdAndDelete({ _id: id });
    res.send({ msg: "Done" });
  }
});

module.exports = { todoRouter };
