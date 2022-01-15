const express = require('express');
const Router = express.Router();
// const passport = require('passport'),
//   LocalStrategy = require('passport-local').Strategy;
const signupController = require('../controllers/authController');

//import controller
const authentification = require('../controllers/authentification');

Router.post(
  '/google',
  authentification.googleVerify,
  authentification.getAthleteId,
  (req, res) => {
    //gets the userId from the middleware's res.locals (once authenticated and/or created in table)
    //then sends it as a cookie to the front-end so state can grab it where needed
    const { athlete_id } = res.locals;
    res.cookie('athleteId', athlete_id, {
      expires: new Date(Date.now() + 1800000),
    });
    return res.status(201).send('cookie sent');
  }
);

Router.post('/signup', signupController.getSignupData, (req, res) => {
  // console.log('its coming here', res.locals.signupData);
  // console.log(res.locals.signupData);
  // if(res.status == 409)
  return res.status(200).send('success');
});

module.exports = Router;
