import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { createAthleteName } from "../reducers/athleteSlice";

const AthleteProfile = ({ athleteId, ...rest }) => {
  const athlete = useSelector((state) => state.athlete.name)
  const dispatch = useDispatch();
  const [athleteName, setAthleteName] = useState("Awesome Athlete");
  const history = useNavigate();

  useEffect(() => {
    fetch(`/api/athlete/info?id=${athleteId}`)
      .then((data) => data.json())
      .then(({ athleteName }) => {
        dispatch(createAthleteName(athleteName))
      });
  }, []);

  return (
    <React.Fragment>
      <h3 className="text-3xl text-center pl-5 mx-20">{athlete} Profile</h3>
      <div className="athlete-card">
        <button
          type="submit"
          onClick={() => history("../dashboard")}
          className="bg-primary content-center text-white font-medium py-1 px-4 border  rounded-lg tracking-wide mr-1 hover:bg-gray-100 first-letter  "
        >
          Main Page
        </button>
      </div>
    </React.Fragment>
  );
};

export default AthleteProfile;
