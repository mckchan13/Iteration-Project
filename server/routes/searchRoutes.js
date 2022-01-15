const express = require("express");
const Router = express.Router();
const queriesRouter = require("../controllers/queriesRoutedToDB");


Router.post("/", queriesRouter.getSearchResult, (req, res) => {
  const { results } = res.locals;
  return res.status(200).json(results);
});


module.exports = Router;
