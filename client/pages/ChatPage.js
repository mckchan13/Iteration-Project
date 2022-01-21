import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Cookies from "js-cookie";
import axios from "axios";
import Header from "../components/Header";
import "../styles/chatPage.css";
import Conversations from "../components/chat/Conversations";
import Message from "../components/chat/Message";
import ChatOnline from "../components/chat/ChatOnline";

const ChatPage = () => {
  const [user, setUser] = useState(Cookies.get("athleteId"));
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const socket = useRef();

  useEffect(() => {
    const getConvo = async () => {
      try {
        const res = await axios.get(`/api/conversation?userId=${user}`);
        setConversations(res.data)
        // console.log(res.data);
      } catch (error) {
        console.log("getConvo error:", error);
      }
    };
    getConvo()
  }, [user]);

  useEffect(() => {
    const getMessages= async () => {
      try {
        const res = await axios.get(`/api/message?conversationId=${currentChat._id}`);
        setMessages(res.data);
        console.log(res.data);
      } catch (error) {
        console.log("getMessages error:", error);
      }
    };
    getMessages();
  }, [currentChat]);

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
            {conversations.map((convo) => (
              <div onClick={() => setCurrentChat(convo)}>
                <Conversations
                  key={convo._id}
                  conversation={convo}
                  currUser={user}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((message) => (
                    <Message message={message} own={message.sender_id===user}/>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    placeholder="Enter Message"
                    className="chatMessageInput"
                  ></textarea>
                  <button className="chatSubmitButton">Send</button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Select A Convo To View Messages
              </span>
            )}
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
