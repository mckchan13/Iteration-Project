import axios from "axios";
import React, { useState, useEffect } from "react";
import "../../styles/online.css";

const ChatOnline = ({ onlineUsers, currUserId, setCurrentChat }) => {
  const [friends, setFriends] = useState([]);
  const [friendsId, setFriendsId] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  useEffect(() => {
    // api call to get all people youre following
    const getFriends = async () => {
      const res = await axios.get(`/api/athlete/currentFollowed?userId=${currUserId}`)
      console.log(res.data)
      setFriends(res.data.followed)
      setFriendsId(res.data.following_id)
    }
    getFriends()
  }, [onlineUsers]);

  useEffect(() => {
    setOnlineFriends(friends.filter((f)=>{friendsId.includes(f._id)}))
  }, [friendsId, friends, onlineUsers]);

  const handleClick = async (user) => {
    try {
      
    } catch (error) {
      
    }
  }
  
  return (
    <div className="chatOnline">
      {onlineFriends.map((online) => (
          <div className="chatOnlineFriend" onClick={handleClick}>
            <div className="chatOnlineImgContainer">
              <img
                className="chatOnlineImg"
                src="https://canary.contestimg.wish.com/api/webimage/5c263b2074a5cc23546e9fa3-large.jpg?cache_buster=13e3d9c6d820556967649c0afc4af380"
                alt=""
              />
              <div className="chatOnlineBadge"></div>
            </div>
          <span className="chatOnlineName">{ online.athlete_name }</span>
          </div>
        ))}
    </div>
  );
};

export default ChatOnline;
