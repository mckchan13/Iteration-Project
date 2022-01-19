const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http").Server(app);
const path = require("path");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const authRouter = require("./routes/authRoutes");
const postRouter = require("./routes/postRoutes");
const athleteRouter = require("./routes/athleteRoutes");
const searchRouter = require("./routes/searchRoutes");


/**
 * enable http request protocol
 *
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
app.use("/api/athlete", athleteRouter);
app.use("/api/search", searchRouter);

// io.on("connection", (socket) => {
//   socket.on("join", () => {
//     console.log("user has joined");
//   });

//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });
// });

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

http.listen(PORT, () => console.log(`Listening at port ${PORT}`));

module.exports = app;
