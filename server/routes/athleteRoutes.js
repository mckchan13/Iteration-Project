const express = require("express");
const Router = express.Router();
const queriesRouter = require("../controllers/queriesRoutedToDB");

//handle athlete-workouts list query to get all the workouts for one athlete
Router.get("/workouts", queriesRouter.getWorkoutsByAthlete, (req, res) => {
  const { workoutsList } = res.locals;
  return res.status(200).json({ workoutsList });
});

//handle request to get the name of the athlete by the Id
Router.get("/info", queriesRouter.getAthleteInfo, (req, res) => {
  const { athleteName } = res.locals;
  return res.status(200).json({ athleteName });
});

module.exports = Router;
