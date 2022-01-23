const express = require("express");
const Router = express.Router();
const messageController = require("../controllers/messageController");

Router.post("/", messageController.addMessage, (req, res) => {
  res.status(200).json(res.locals.message);
});

Router.get("/", messageController.getMessage, (req, res) => {
  res.status(200).json(res.locals.message);
});

module.exports = Router;
