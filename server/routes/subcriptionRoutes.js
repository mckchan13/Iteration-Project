const express = require("express");
const Router = express.Router();
const subcription = require("../controllers/subcription");

//first query to check if the is relationship exit
Router.post("/subcriptionStatus", subcription.relationship, (req, res) => {
  console.log("there is a relationship");
  const followingStatus = res.locals.followingStatus;
  return res.status(200).json({ followingStatus });
});

//handle inserting follow relationship
Router.post("/subcription", subcription.addFollower, (req, res) => {
  // res.locals.subcriptStatus = "Following";
  console.log("post request for adding subscription");
  return res.status(200).json("Following");
});

//handle delete follow relationship
Router.delete("/subcription", subcription.deleteFollower, (req, res) => {
  // res.locals.subcriptStatus = "Unfollow";
  console.log("unfollowing a user");
  return res.status(200).json("Unfollow");
});

module.exports = Router;
