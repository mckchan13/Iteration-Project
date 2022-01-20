import React from "react";
import "../../styles/message.css";

const Message = ({own}) => {
  return (
    <div className={own ? "message own" : 'message'}>
      <div className="messageTop">
        <img
          className="messageImg"
          src="https://canary.contestimg.wish.com/api/webimage/5c263b2074a5cc23546e9fa3-large.jpg?cache_buster=13e3d9c6d820556967649c0afc4af380"
          alt=""
        />
        <p className="messageText">Hello</p>
      </div>
      <div className="messageBottom"> 1 Hour Ago</div>
    </div>
  );
};

export default Message;
