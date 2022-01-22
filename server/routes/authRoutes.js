const express = require('express');
const Router = express.Router();
// const passport = require('passport'),
//   LocalStrategy = require('passport-local').Strategy;
const signupController = require('../controllers/authController');

//import controller
const authentification = require('../controllers/authentification');
// const initializePassport = require('../config/passport');
const passport = require('passport');

// Router.post(
//   '/google',
//   authentification.googleVerify,
//   authentification.getAthleteId,
//   (req, res) => {
//     //gets the userId from the middleware's res.locals (once authenticated and/or created in table)
//     //then sends it as a cookie to the front-end so state can grab it where needed
//     const { athlete_id } = res.locals;
//     res.cookie('athleteId', athlete_id, {
//       expires: new Date(Date.now() + 1800000),
//     });
//     return res.status(201).send('cookie sent');
//   }
// );

Router.post(
  '/google', passport.authenticate('google'), (req, res) => {
    //gets the userId from the middleware's res.locals (once authenticated and/or created in table)
    //then sends it as a cookie to the front-end so state can grab it where needed
    return res.status(200).send('success');
  }
);

Router.post('/signup', signupController.getSignupData, (req, res) => {
  // console.log('its coming here', res.locals.signupData);
  // console.log(res.locals.signupData);
  // if(res.status == 409)
  return res.status(200).send('success');
});

Router.post('/login', passport.authenticate('local.login'), (req, res) => {
  // console.log('this is res', res);
  const { athlete_id } = req.user;
  console.log('this is req.session.passport', req.session.passport)
  // console.log('this is requser', req.user._id);
  // console.log('this is reqcookies', req.cookies);
  // console.log(res)
  return res.status(200).json(req.session.passport);
});

// Router.post('/login', function (req, res, next) {
//   passport.authenticate(
//     'local',
//     { session: false },
//     function (err, user, token_record) {
//       if (err) {
//         return next(err);
//       }
//       res.json({ access_token: token_record.access_token });
//     }
//   )(req, res, next);
// });

Router.get('/checkAuth', (req, res) => {
  console.log(req.isAuthenticated());
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
