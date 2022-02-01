const express = require("express");
const Router = express.Router();

const queriesRouter = require("../controllers/queriesRoutedToDB");

//handle workouts-list query for workout cards data
Router.get(
  "/workoutslist",
  queriesRouter.uniqueWorkoutList,
  queriesRouter.getWorkoutsList,
  (req, res) => {
    console.log(req.cookies)
    const { workoutsList, uniqueWorkoutList } = res.locals;
    console.log('this is the workoutsList length', workoutsList.length)
    console.log('this is the uniqueWorkoutList length', uniqueWorkoutList.length)
    const newWorkoutsList = workoutsList.filter((el) => !uniqueWorkoutList.includes(el));
    // const list = [...uniqueWorkoutList, ...newWorkoutsList];
    const list = workoutsList;
    // workoutsList.unshift(...uniqueWorkoutList);
    console.log('this is the list length', list.length)
    return res.status(200).json({ list });
  }
);

//handle post-workout route to add a workout to workout_card table
Router.post("/workout", queriesRouter.postWorkout, (req, res) => {
  return res.status(200).json({ post: res.locals.post });
});

Router.post("/workout/like", queriesRouter.likeWorkout, (req, res) => {
  const { likedPost } = res.locals
  return res.status(200).json({ likedPost });
});

Router.delete("/workout/unlike", queriesRouter.unlikeWorkout, (req, res) => {
  const { likedPost } = res.locals
  return res.status(200).json({ likedPost });
});

Router.get("/workout/:post", queriesRouter.getWorkout, (req, res) => {
  return res.status(200).json(res.locals.post);
});

//handle tag
Router.post("/tag", queriesRouter.postTag, (req, res) => {
  return res.status(200).send("tag created");
});

module.exports = Router;
