import React, { useState, useEffect } from "react";
import "../../styles/online.css";

const ChatOnline = ({ onlineUsers, currUserId, setCurrentChat }) => {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  useEffect(() => {
    // api call to get all people youre following
    //set them as friends
  }, [onlineUsers]);

  useEffect(() => {
    // loop through online users and see if id matches friends
    //set them as onlinefriends
  }, [onlineUsers]);
  
  return (
    <div className="chatOnline">
      {onlineMinusCurrUser &&
        onlineMinusCurrUser.map((user) => (
          <div className="chatOnlineFriend">
            <div className="chatOnlineImgContainer">
              <img
                className="chatOnlineImg"
                src="https://canary.contestimg.wish.com/api/webimage/5c263b2074a5cc23546e9fa3-large.jpg?cache_buster=13e3d9c6d820556967649c0afc4af380"
                alt=""
              />
              <div className="chatOnlineBadge"></div>
            </div>
            <span className="chatOnlineName">John Doe</span>
          </div>
        ))}
    </div>
  );
};

export default ChatOnline;
