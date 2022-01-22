const express = require("express");
const Router = express.Router();

const queriesRouter = require("../controllers/queriesRoutedToDB");

//handle workouts-list query for workout cards data
Router.get("/workoutslist", queriesRouter.getWorkoutsList, (req, res) => {
  console.log('this is workoutlist', req.session.passport.user);
  const { workoutsList } = res.locals;
  return res.status(200).json({ workoutsList });
});

//handle post-workout route to add a workout to workout_card table
Router.post("/workout", queriesRouter.postWorkout, (req, res) => {
  return res.status(200).json({ post: res.locals.post });
});

//handle tag 
Router.post("/tag", queriesRouter.postTag, (req, res) => {
  return res.status(200).send("tag created");
});

module.exports = Router;
