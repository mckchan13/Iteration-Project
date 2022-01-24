import axios from "axios";
import React, { useState, useEffect } from "react";
import "../../styles/online.css";

const ChatOnline = ({ onlineUsers, currUserId, setCurrentChat, setConversations}) => {
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
    //need to parse through onlineUsers
    setOnlineFriends(friends.filter((f) => {
      return friendsId.includes(f._id)
    }))

  }, [friendsId, friends, onlineUsers]);

  
  const handleClick = async (user) => {
    try {
      const res = await axios.get(`/api/conversation/getOne?user1Id=${user}&user2Id=${currUserId}`);

      if (res.data.length > 0) {
        return setCurrentChat(res.data[0])
      }

      else {
        const payload = {
          senderId: currUserId,
          receiverId: user
        }
        const add = await axios.post(`/api/conversation`, payload );
        //need to setCurrentChat
        setCurrentChat(add.data)
      }

    } catch (error) {
      console.log(error)
    }
  }

  console.log(onlineFriends)
  
  return (
    <div className="chatOnline">
      {onlineFriends && onlineFriends.map((online) => (
          <div className="chatOnlineFriend" onClick={()=>handleClick(online._id)}>
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
