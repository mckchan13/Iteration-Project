const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const env = require('dotenv').config();
const PORT = process.env.PORT || 3000;
const authRouter = require('./routes/authRoutes');
const postRouter = require('./routes/postRoutes');
const athleteRouter = require('./routes/athleteRoutes');
const passport = require('passport');
const Dotenv = require('dotenv-webpack');
const session = require('express-session');
require('./config/passport')(passport);
const http = require("http");
const io = require("socket.io");
require("dotenv").config();
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
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }, //this is 1 hour
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res, next) => {
  return res.status(200).send('the server is working');
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
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log('this is the error', err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => console.log(`Listening at port ${PORT}`));

module.exports = app;
