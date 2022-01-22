import React, { useState, useEffect } from "react";
import WorkoutCard from "./WorkoutCard";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Feed = ({ workoutsList, getWorkOutsList }) => {
  // populate array with workout card components
  const athleteId = Cookies.get("athleteId");
  const workoutCards = [];
  const history = useNavigate();
  workoutsList.forEach((workout, i) => {
    workoutCards.push(
      <WorkoutCard
        athleteId = {athleteId}
        workoutTitle={workout["workout_title"]}
        workoutContent={workout["workout_content"]}
        date={workout["date"]}
        cardAthleteId={workout["athlete_id"]}
        athleteName={workout["athlete_name"]}
        // picture={workout["picture"]} TO DO: Add picture to the database
        likedby={workout["likedby"]}
        // comments={workout["comments"]} TO DO: Add likes to the database
        cardId={workout["_id"]}
        key={workout["_id"]}
        getWorkOutsList={getWorkOutsList}
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
