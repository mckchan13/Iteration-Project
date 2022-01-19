import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Cookies from "js-cookie";

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
      <header>React Chat</header>
      {socket !== null ? <div>connected</div> : <div>Not Connected</div>}
    </div>
  );
};

export default ChatPage;
