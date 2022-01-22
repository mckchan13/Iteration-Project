import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Cookies from "js-cookie";
import axios from "axios";
import Header from "../components/Header";
import "../styles/chatPage.css";
import Conversations from "../components/chat/Conversations";
import Message from "../components/chat/Message";
import ChatOnline from "../components/chat/ChatOnline";
import { format } from "timeago.js";

const ChatPage = () => {
  const [user, setUser] = useState(Cookies.get("athleteId"));
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  
  const scroll = useRef();
  const socket = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:3000");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        message: data.message,
        conversation_Id: currentChat._id,
        sender_Id: data.senderId,
        date: format(Date.now()),
      });
    });
  }, []);

  useEffect(() => {
    //TODO: comeback here to check
    arrivalMessage &&
      currentChat.receiver_id == arrivalMessage.senderId &&
      setMessages((prev)=>[...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", user);
    socket.current.on("getUsers", (users) => {
      console.log(users)
      setOnlineUsers(users);
    });
  }, [user]);

  useEffect(() => {
    const getConvo = async () => {
      try {
        const res = await axios.get(`/api/conversation?userId=${user}`);
        setConversations(res.data);
        // console.log(res.data);
      } catch (error) {
        console.log("getConvo error:", error);
      }
    };
    getConvo();
  }, [user]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(
          `/api/message?conversationId=${currentChat._id}`
        );
        setMessages(res.data);
      } catch (error) {
        console.log("getMessages error:", error);
      }
    };
    getMessages();
  }, [currentChat]);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newMessage) {
      return console.log("Enter New Message");
    }

    socket.current.emit("sendMessage", {
      senderId: user,
      receiverId: currentChat.receiver_id,
      message: newMessage,
    });

    try {
      const mess = {
        message: newMessage,
        conversationId: currentChat._id,
        senderId: user,
      };

      const res = await axios.post("/api/message", mess);
      console.log(res);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (error) {
      console.log("handleSubmit error:", error);
    }
  };

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
                <Conversations key={convo._id} conversation={convo} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div ref={scroll}>
                      <Message
                        key={m._id}
                        message={m}
                        own={m.sender_id == user}
                      />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    placeholder="Enter Message..."
                    className="chatMessageInput"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
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
            <ChatOnline onlineUsers={onlineUsers} currUserId={user} setCurrentChat={setCurrentChat}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
