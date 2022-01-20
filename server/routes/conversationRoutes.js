const express = require("express");
const Router = express.Router();
const conversationController = require("../controllers/conversationController");

Router.post("/", conversationController.addConversation, (req, res) => {
  res.status(200).json(res.locals.conversation);
});

Router.get("/", conversationController.getConversation, (req, res) => {
  res.status(200).json(res.locals.conversation);
});

module.exports = Router;
