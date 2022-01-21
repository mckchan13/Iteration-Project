import React, { useState, useEffect } from "react";
import "../../styles/conversations.css";
import axios from "axios";

const Conversations = ({ conversation }) => {
  const [receiver, setReceiver] = useState(null);

  useEffect(() => {
    const getReceiver = async () => {
      try {
        const res = await axios.get(
          `/api/athlete/info?id=${conversation.receiver_id}`
        );
        setReceiver(res.data.athleteName);
        // console.log(res.data);
      } catch (error) {
        console.log("getReceiver error:", error);
      }
    };
    getReceiver();
  }, []);

  return (
    <div className="conversation">
      <img
        className="conversationImg"
        src="https://canary.contestimg.wish.com/api/webimage/5c263b2074a5cc23546e9fa3-large.jpg?cache_buster=13e3d9c6d820556967649c0afc4af380"
        alt=""
      />
      <span className="conversationName">{receiver}</span>
    </div>
  );
};

export default Conversations;
