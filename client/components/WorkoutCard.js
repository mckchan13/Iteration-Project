import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

const WorkoutCard = ({ cardId, workoutTitle, workoutContent, date, cardAthleteId, athleteName, athleteId, picture, likedby, hasLiked, comments, }) => {
  const currentUser = athleteId
  console.log(likedby)
  const [liked, setLiked] = useState(likedby[athleteId] ? true : false);

  const handleLike = async (e) => {
    e.preventDefault();
    // console.log("You have clicked the submit button.");
    //writing to the database
    const headers = {
      headers: { "Content-Type": "application/json" },
    };

    const result = await axios.post(
      "/api/post/workout/like",
      { workout_id : cardId, athlete_id : currentUser },
      headers
    );
    setLiked(true)
    //reset the content of text field after post

  }

  const LikeButton = () => {
    return (
      liked ? 
      <button 
      type="submit"
      onClick={handleLike}
      className="bg-primary text-white font-medium py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-100">
        Thumbs Down
      </button>
      : 
      <button 
      type="submit"
      onClick={handleLike}
      className="bg-primary text-white font-medium py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-100">
        Thumbs Up
      </button>
    )
  }
  
  
  const roundDate = (date) => {
    return date.split("T")[0]
  }

  return (
    <div className=" bg-center max-w-xl px-4 py-4 bg-white shadow-md rounded-lg hover:bg-gray-100">
      <div className="bg-blue100 shadow-md rounded-lg hover:bg-gray-100 py-5 px-2">
        Workout Card ID:  {`${cardId}`}<br></br>
        Workout Title: {`${workoutTitle}`}<br></br>
        <img src={picture ? picture : "https://seranking.com/blog/wp-content/uploads/2021/01/404_01-min.jpg"} className="card-img-top img-thumbnail rounded mx-auto d-block" alt="..." style={{ width: '15rem', height: '15rem', objectFit: 'contain' }} />
        Workout Content: {workoutContent}
      </div>
      {/* <div>Athlete Name: {athleteName}</div> */}
      <div>
        {athleteName}:{" "}
        <Link to={`../athletepage/${cardAthleteId}`} className="underline">
          View Profile
        </Link>
      </div>
      <div>Date: {roundDate(date)}</div>
      <LikeButton/><br></br>
      {/* <button type="submit" 
      onClick={handleLike}
      className="bg-primary text-white font-medium py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-100"
      >
        Thumbs Up
      </button> */}

    </div>
  );
};

export default WorkoutCard;
