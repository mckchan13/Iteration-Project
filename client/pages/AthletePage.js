import React, { useState, useEffect } from "react";
import Feed from "../components/Feed";
import AthleteProfile from "../components/AthleteProfile";
import Header from "../components/Header";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import workoutParser from "../utils/workoutParser";

const AthletePage = ({ athleteId }) => {
  const [workoutsList, setWorkoutsList] = useState([]);

  const params = useParams();
  if (params.athleteId) athleteId = params.athleteId;

  //handle get request to find the workouts for a single athlete (from the cookies athleteId set on login)
  const getWorkOutsList = () => {
    const url = params.athleteId ? `/api/athlete/workouts/${params.athleteId}` : `/api/athlete/workouts/`
    return (
      fetch(url)
        .then((res) => res.json())
        .then(({workoutsList}) => {
          // workoutParser helper function needed to parse SQL data in desired format
          setWorkoutsList(workoutParser(workoutsList)) 
        })
    );
  };

  // on mount fetch workout-list for the specific athlete from server
  useEffect(() => {
    getWorkOutsList();
  }, []);

  return (
    <React.Fragment>
      <Header />
      <div
        id="Athlete-Page"
        className="bg-neutral grid grid-cols-1 gap-6 my-5 px-4 md:px-6 lg:px-8"
      >
        <div className="bg-neutral grid grid-cols-2 gap-2 my-5 px-4 md:px-6 lg:px-8">
          <AthleteProfile athleteId={athleteId}/>
        </div>
        <Feed workoutsList={workoutsList} getWorkOutsList={getWorkOutsList}/>
      </div>
    </React.Fragment>
  );
};

export default AthletePage;
