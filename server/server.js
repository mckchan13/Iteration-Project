const express = require("express");
const app = express();
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const authRouter = require("./routes/authRoutes");
const postRouter = require("./routes/postRoutes");
const athleteRouter = require("./routes/athleteRoutes");
const searchRouter = require("./routes/searchRoutes");
const subscriptionRouter = require("./routes/subscriptionRoutes");
const conversationRouter = require("./routes/conversationRoutes");
const messageRouter = require("./routes/messageRoutes");
const cookieParser = require("cookie-parser");
const socketUtil = require("./util/socketUtil.js");

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:8080",
  },
});

app.use(express.json());

app.use(cors());

app.use(cookieParser());

app.get("/", (req, res, next) => {
  return res.status(200).send("the server is working");
});

//
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/athlete", athleteRouter, subscriptionRouter);
app.use("/api/search", searchRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/message", messageRouter);

//socket.io setup
io.on("connection", (socket) => {
  //when connected
  console.log("a user is connected", socket.id);

  //displaying online users to all clients
  socket.on("addUser", (userId) => {
    socketUtil.addUser(userId, socket.id);
    io.emit("getUsers", socketUtil.users);
  });

  //send and get messages
  socket.on("sendMessage", ({ senderId, receiverId, message, conversationId }) => {
    const receiver = socketUtil.getUser(receiverId);
    io.to(receiver.socketId).emit("getMessage", { senderId, message, conversationId });
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("user left", socket.id);
    socketUtil.removeUser(socket.id);
    io.emit("getUsers", socketUtil.users);
  });
});

//handle page not found
app.use((req, res) =>
  res.status(404).send("This is not the page you're looking for...")
);

//global error middleware
app.use((err, req, res, next) => {
  const defaultErr = {
    log: "Express error handler caught unknown middleware error",
    status: 500,
    message: { err: "An error occurred" },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

httpServer.listen(PORT, () => console.log(`Listening at port ${PORT}`));

module.exports = app;
