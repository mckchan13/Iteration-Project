import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";

const AthleteProfile = ({ athleteId, ...rest }) => {
  const [athleteName, setAthleteName] = useState("Awesome Athlete");
  const [subcript, setSubcription] = useState("Follow");
  const history = useNavigate();
  const data = {
    currentAthletePageId: athleteId,
    currentUserId: Cookies.get("athleteId"),
  };

  useEffect(() => {
    fetch(`/api/athlete/info?id=${athleteId}`)
      .then((data) => data.json())
      .then(({ athleteName }) => {
        console.log(athleteName);
        setAthleteName(athleteName);
      });
  });

  useEffect(async () => {
    try {
      console.log("fetch request for subcription status");
      const response = await fetch(`/api/athlete/subcriptionStatus`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      let res = await response.json();
      let followingStatus = res.followingStatus;
      setSubcription(followingStatus);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const subcription = async () => {
    console.log(
      `currentUser = ${data.currentUserId} is following ${data.currentAthletePageId}`
    );

    //follow a user
    if (subcript === "Follow") {
      console.log(subcript, "running fetch to the backend to add relationship");
      // go fetch request to add into follow link into the subcription table
      const response = await fetch(`/api/athlete/subcription`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      let res = await response.json();
      if (res === "Following") {
        setSubcription("Unfollow");
      }
    }

    //un-follow a user
    if (subcript === "Unfollow" || subcript === "Following") {
      // go fetch request to add into follow link into the subcription table
      console.log(subcript, "running fetch to the backend to add relationship");
      fetch(`/api/athlete/subcription`, {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          // console.log(res);
          if (res === "Unfollow") {
            setSubcription("Follow");
          }
        });
    }
  };

  return (
    <React.Fragment>
      <div className="athlete-card">
        <button
          type="submit"
          onClick={() => history("../dashboard")}
          className="bg-primary content-center text-white font-medium py-1 px-4 border  rounded-lg tracking-wide mr-1 hover:bg-gray-100 first-letter  "
        >
          Main Page
        </button>
        <button
          type="submit"
          onClick={() => subcription()}
          className="bg-primary content-center text-white font-medium py-1 px-4 border  rounded-lg tracking-wide mr-1 hover:bg-gray-100 first-letter  "
        >
          {subcript}
        </button>
      </div>
      <h3 className="text-3xl text-center pl-5 mx-20">{athleteName} Profile</h3>
    </React.Fragment>
  );
};

export default AthleteProfile;
