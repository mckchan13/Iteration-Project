import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Cookies from "js-cookie";
import Header from "../components/Header"
import '../styles/chatPage.css'
import Conversations from "../components/chat/Conversations";
import Message from "../components/chat/Message";
import ChatOnline from "../components/chat/ChatOnline";

const ChatPage = () => {
  const [user, setUser] = useState(Cookies.get("athleteId"));
  const socket = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:3000");
  }, []);

  useEffect(() => {
    socket.current.emit("addUser", user);
    socket.current.on("getUsers", (users) => {
      console.log(users);
    });
  }, [user]);

  return (
    <div>
      <Header />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input
              placeholder="Search for friends"
              className="chatMenuInput"
            ></input>
            <Conversations />
            <Conversations />
            <Conversations />
            <Conversations />
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            <div className="chatBoxTop">
              <Message />
              <Message own={true} />
              <Message />
            </div>
            <div className="chatBoxBottom">
              <textarea
                placeholder="Enter Message"
                className="chatMessageInput"
              ></textarea>
              <button className="chatSubmitButton">Send</button>
            </div>
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline />
            <ChatOnline />
            <ChatOnline />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
