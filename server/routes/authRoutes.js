const express = require('express');
const Router = express.Router();
// const passport = require('passport'),
//   LocalStrategy = require('passport-local').Strategy;
const signupController = require('../controllers/authController');

//import controller
const authentification = require('../controllers/authentification');
// const initializePassport = require('../config/passport');
const passport = require('passport');

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

// Router.post(
//   '/google', passport.authenticate('google'), (req, res) => {
//     //gets the userId from the middleware's res.locals (once authenticated and/or created in table)
//     //then sends it as a cookie to the front-end so state can grab it where needed
//     return res.status(200).send('success');
//   }
// );

Router.post('/signup', signupController.getSignupData, (req, res) => {
  return res.status(200).send('success');
});

Router.post('/login', passport.authenticate('local.login'), (req, res) => {
  return res.status(200).json(req.session.passport);
});

Router.get('/checkAuth', passport.authenticate('local.login'), signupController.checkAuth, (req, res) => {
  if (req.isAuthenticated())
    return res.status(200).send('authorized');
  else 
    return res.status(401).send('unauthorized'); 
})

Router.post('/logout', function(req, res){
  req.logout();
  return res.status(200).send('logged out');
});

module.exports = Router;
