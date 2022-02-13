import React, { useState, useEffect } from "react";
import PostWorkoutContainer from "../components/PostWorkoutContainer";
import Feed from "../components/Feed";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import workoutParser from "../utils/workoutParser";
import Cookies from "js-cookie";

const DashboardContainer = ({ currUser }) => {
  const [workoutsList, setWorkoutsList] = useState([]);
  const history = useNavigate();
  // const athleteId = Cookies.get('athleteId');
  console.log('the currUser', currUser)
  //need to pass userID into dashboard
  //handle post function takes in nothing

  /* original getWorkOutsList function */
  // const getWorkOutsList = () => {
  //   return (
  //     fetch('/api/post/workoutslist')
  //       .then((res) => res.json())
  //       // set state
  //       .then((data) => {
  //         console.log('fetching data.list', data.list)
  //         setWorkoutsList(workoutParser(data.list)) //fix this workoutsParser
  //       })
  //   );
  // };
  /**/

 const getWorkOutsList = () => {

    const getWorkoutsListQuery = `
      query {
          getAllWorkoutCards {
            _id
            workout_content
            date
            workout_title
            athlete_id
        }
      }
    `
    return (
      fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: getWorkoutsListQuery,
        })
      })
        .then((res) => res.json())
        // set state
        .then((data) => {
          console.log('graphQL fetch', data)
          // setWorkoutsList(data.getAllWorkoutCards)
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
          <h3 className="text-3xl text-center pl-5 mx-20">Dashboard {currUser}</h3>
          <button
            type="submit"
            onClick={() => history(`../athletepage/${sessionStorage.userId}`)}
            className="bg-primary content-center text-white font-medium py-1 px-4 border  rounded-lg tracking-wide mr-1 hover:bg-gray-100 first-letter  "
          >
            My Athlete Profile 
          </button>
        </div>
        <div
          id="main"
          className="bg-neutral grid grid-cols-2 gap-2 my-6 px-4 md:px-6 lg:px-8 relative"
        >
          <Feed workoutsList={workoutsList} getWorkOutsList={getWorkOutsList} currUser={currUser}/>
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
