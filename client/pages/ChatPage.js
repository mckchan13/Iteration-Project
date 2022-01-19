import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const ChatPage = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
      const newSocket = io(`http://localhost:8080`);
      console.log(newSocket)
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  return (
    <div>
      <header>React Chat</header>
      {socket ? (
        <div>
          connected
          
        </div>
      ) : (
        <div>Not Connected</div>
      )}
    </div>
  );
};

export default ChatPage;
