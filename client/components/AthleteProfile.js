import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";

const AthleteProfile = ({ athleteId, ...rest }) => {
  const [athleteName, setAthleteName] = useState("Awesome Athlete");
  const [subscript, setSubscription] = useState("Follow");
  const params = useParams();
  const history = useNavigate();

  const data = {
    currentAthletePageId: params.athleteId
  };
  
  useEffect(() => {
    fetch(`/api/athlete/info/${athleteId}`)
      .then((data) => data.json())
      .then(({ athleteName }) => {
        setAthleteName(athleteName);
      });
  });
  
  useEffect(async () => {
    try {
      console.log("fetch request for subscription status");
      const response = await fetch(
        `/api/athlete/subscriptionStatusTo?currentAthletePageId=${params.athleteId}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let res = await response.json();
      let followingStatus = res.followingStatus;
      setSubscription(followingStatus);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const subscription = async () => {
    console.log(
      `currentUser = ${data.currentUserId} is following ${data.currentAthletePageId}`
    );

    //follow a user
    if (subscript === "Follow") {
      console.log(
        subscript,
        "running fetch to the backend to add relationship"
      );
      // go fetch request to add into follow link into the subscription table
      const response = await fetch(`/api/athlete/subscription`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentAthletePageId: params.athleteId
        }),
      });
      let res = await response.json();
      if (res === "Following") {
        setSubscription("Unfollow");
      }
    }

    //un-follow a user
    if (subscript === "Unfollow" || subscript === "Following") {
      // go fetch request to add into follow link into the subscription table
      console.log(
        subscript,
        "running fetch to the backend to add relationship"
      );
      fetch(`/api/athlete/subscription`, {
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
          if (res === "Unfollow") {
            setSubscription("Follow");
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
          onClick={() => subscription()}
          className="bg-primary content-center text-white font-medium py-1 px-4 border  rounded-lg tracking-wide mr-1 hover:bg-gray-100 first-letter  "
        >
          {subscript}
        </button>
      </div>
      <h3 className="text-3xl text-center pl-5 mx-20">{athleteName} Profile</h3>
    </React.Fragment>
  );
};

export default AthleteProfile;
