const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const io = require("socket.io");
const path = require("path");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const authRouter = require("./routes/authRoutes");
const postRouter = require("./routes/postRoutes");
const athleteRouter = require("./routes/athleteRoutes");
const searchRouter = require("./routes/searchRoutes");
const subscriptionRouter = require("./routes/subscriptionRoutes");
const cookieParser = require("cookie-parser");

/**
 * enable http request protocol
 */
app.use(cookieParser());

/**
 * enable http request protocol
 */

app.use(cors());

/**
 * handle parsing request body
 */
app.use(express.json());

app.get("/", (req, res, next) => {
  return res.status(200).send("the server is working");
});

app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/athlete", athleteRouter, subscriptionRouter);
app.use("/api/search", searchRouter);

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

app.listen(PORT, () => console.log(`Listening at port ${PORT}`));

module.exports = app;
