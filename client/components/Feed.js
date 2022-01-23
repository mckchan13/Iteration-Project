import React, { useState, useEffect } from "react";
import WorkoutCard from "./WorkoutCard";
import { useNavigate } from "react-router-dom";

const Feed = ({ workoutsList }) => {
  // populate array with workout card components
  const workoutCards = [];
  const history = useNavigate();
  workoutsList.forEach((workout, i) => {
    console.log("222222 " + workout["athlete_id"])
    workoutCards.push(
      <WorkoutCard
        // key={`${i} WorkoutCard`}
        workoutContent={workout["workout_content"]}
        date={workout["date"]}
        cardAthleteId={workout["athlete_id"]}
        athleteName={workout["athlete_name"]}
        // key={`${workout["_id"]} and ${workout["athlete_name"]}}`}
        history={history}
      ></WorkoutCard>
    );
  });

  return (
    <div
      id="feed"
      className="bg-neutral rounded grid  grid-cols-1 gap-6 my-6 px-4 md:px-6 lg:px-8"
    >
      {workoutCards}
    </div>
  );
};

export default Feed;
