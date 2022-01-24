const express = require("express");
const Router = express.Router();
const subscription = require("../controllers/subscription");

//first query to check if the is relationship exit
Router.get("/subscriptionStatusTo", subscription.relationship, (req, res) => {
  console.log("there is a relationship");
  const followingStatus = res.locals.followingStatus;
  return res.status(200).json({ followingStatus });
});

Router.get("/currentFollowed", subscription.getFollowed, (req, res) => {
  
  return res.status(200).json({followed: res.locals.followed, following_id: res.locals.following_id });
});

//handle inserting follow relationship
Router.post("/subscription", subscription.addFollower, (req, res) => {
  // res.locals.subscriptStatus = "Following";
  console.log("post request for adding subscription");
  return res.status(200).json("Following");
});

//handle delete follow relationship
Router.delete("/subscription", subscription.deleteFollower, (req, res) => {
  // res.locals.subscriptStatus = "Unfollow";
  console.log("unfollowing a user");
  return res.status(200).json("Unfollow");
});

module.exports = Router;
