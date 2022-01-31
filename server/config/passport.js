const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const bcrypt = require('bcrypt');
const db = require('../database/psqlTables');

function initialize(passport) {
  const authenticateUser = async (username, password, done) => {
    const findUser = await db.query(
      'SELECT * from athletes WHERE email_address = $1;',
      [username]
    );
    if (findUser.rowCount === 0) {
      return done(null, false);
    }
    const localUser = findUser.rows[0];
    const isMatch = await bcrypt.compare(password, localUser.password);

    if (!isMatch) {
      return done(null, false);
    } else {
      delete localUser.password;
      localUser.id = localUser._id;
      return done(null, localUser);
    }
  };

  passport.use(
    'local.login',
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      authenticateUser
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id); // sends back to client as hash
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
}

module.exports = initialize;
