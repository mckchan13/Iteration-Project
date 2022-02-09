import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { blue } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown'

const WorkoutCard = ({ cardId, workoutTitle, workoutContent, date, cardAthleteId, athleteName, athleteId, picture, likedby, currUser, getWorkOutsList }) => {
  const currentUser = currUser;
  const numLikes = Object.keys(likedby).length
  const [liked, setLiked] = useState(likedby[currentUser] ? true : false);

  const handleLike = async (e) => {
    e.preventDefault();
    const headers = {
      headers: { "Content-Type": "application/json" },
    };
    if (!liked) {
      const result = await axios.post(
        "/api/post/workout/like",
        { workout_id : cardId, athlete_id : currentUser },
        headers
      );
      console.log('the current card\'s creator is:', athleteName)
      setLiked(true)
      getWorkOutsList()
    } else {
      const result = await axios({
        method: 'delete',
        url: '/api/post/workout/unlike',
        data: {
          workout_id : cardId,
          athlete_id : currentUser,
        }
      });
      console.log('the current card\'s creator is:', athleteName)
      setLiked(false);
      getWorkOutsList();
    }
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
      <div>Number of Likes: {numLikes}</div>
      <IconButton onClick={handleLike}>
      {liked ? <ThumbDownIcon sx={{ color: blue[500] }}/> : <ThumbUpIcon sx={{ color: blue[500] }}/> }
      </IconButton>
      {/* <LikeButton/><br></br> */}
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
