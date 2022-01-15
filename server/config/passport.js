const LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport) {
  passport.use(
    'local-signup',
    new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true, // allows us to pass back the entire request to the callback
    })
  );
};
