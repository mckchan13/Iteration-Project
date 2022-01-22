import React, { useState, useEffect } from "react";
import PostWorkoutContainer from "../components/PostWorkoutContainer";
import Feed from "../components/Feed";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const DashboardContainer = (props) => {
  const [workoutsList, setWorkoutsList] = useState([]);
  const history = useNavigate();
  const athleteId = Cookies.get("athleteId");
  
  //handle post function takes in nothing
  const getWorkOutsList = () => {
    // console.log("getworkoutlist function is being invoked");
    return (
      fetch("/api/post/workoutslist")
        .then((res) => res.json())
        // set state
        .then(({workoutsList}) => {
          console.log(workoutsList)
          const workoutIdCache = {};
          const parsedWorkoutsList = [];
          for (let i = 0; i < workoutsList.length; i++) {
            if (!workoutIdCache[workoutsList[i]._id]) {
              workoutIdCache[workoutsList[i]._id] = parsedWorkoutsList.length;
              const { likedby } = workoutsList[i]
              const newWorkoutCard = {...workoutsList[i], likedby: {}}
              if (!likedby) {
                parsedWorkoutsList.push(newWorkoutCard);
                continue;
              }
              newWorkoutCard.likedby[likedby] = true;
              parsedWorkoutsList.push(newWorkoutCard);
            } else {
              const currIdx = workoutIdCache[workoutsList[i]._id]
              const { likedby } = workoutsList[i]
              if (!likedby) {
                continue;
              }
              parsedWorkoutsList[currIdx].likedby[likedby] = true;
            }
          }
          console.log(parsedWorkoutsList)
          return setWorkoutsList(parsedWorkoutsList)
        })
    );
  };
  // on mount fetch workout-list from server
  useEffect(() => {
    getWorkOutsList();
  }, []);

  return (
    <React.Fragment>
      <Header />
      <div id="dashboard-container">
        <div className="flex my-5">
          <h3 className="text-3xl text-center pl-5 mx-20">Dashboard</h3>
          <button
            type="submit"
            onClick={() => history(`../athletepage/${athleteId}`)}
            className="bg-primary content-center text-white font-medium py-1 px-4 border  rounded-lg tracking-wide mr-1 hover:bg-gray-100 first-letter  "
          >
            My Athlete Profile
          </button>
        </div>
        <div className="bg-neutral grid grid-cols-2 gap-2 my-6 px-4 md:px-6 lg:px-8 relative">
          <Feed workoutsList={workoutsList} />
          <PostWorkoutContainer
            id="styling-PostWorkoutCentainer"
            className="box-content"
            getWorkOutsList={getWorkOutsList}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default DashboardContainer;
