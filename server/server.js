const express = require("express");
const app = express();
const cors = require("cors");
const { createServer } = require("http");
const {Server } = require("socket.io");
const path = require("path");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const authRouter = require("./routes/authRoutes");
const postRouter = require("./routes/postRoutes");
const athleteRouter = require("./routes/athleteRoutes");
const searchRouter = require("./routes/searchRoutes");
const subscriptionRouter = require("./routes/subscriptionRoutes");
const cookieParser = require("cookie-parser");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:8080",
  },
});
/**
 * enable http request protocol
 */

app.use(cors());
/**
 * enable http request protocol
 */
app.use(cookieParser());

/**
 * handle parsing request body
 */
app.use(express.json());

app.get("/", (req, res, next) => {
  return res.status(200).send("the server is working");
});

//
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/athlete", athleteRouter, subscriptionRouter);
app.use("/api/search", searchRouter);

io.on("connection", (socket) => {
  console.log("a user is conencted");

  socket.on("join", () => {
    console.log("user joined");
  });

  socket.on("disconnect", () => {
    console.log("user left");
  });
});

// Socket.io

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
