const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const bcrypt = require('bcrypt');
const db = require('../database/psqlTables');

function initialize(passport) {
  console.log('000000');
  const authenticateUser = async (username, password, done) => {
    const findUser = await db.query(
      'SELECT * from athletes WHERE email_address = $1;',
      [username]
    );
    console.log(findUser.rows);
    if (findUser.rowCount === 0) {
      return done(null, false);
    }
    const localUser = findUser.rows[0];
    const isMatch = await bcrypt.compare(password, localUser.password);
    // console.log('this is real pw', password);
    // console.log('this is localUser', localUser);
    // console.log('this is lu pw', localUser.password);
    console.log('this isMatch', isMatch);
    console.log('this is luid', localUser._id);
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

  passport.use(
    'google',
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
        passReqToCallback: true,
      },
      async (request, accessToken, refreshToken, profile, done) => {
        const checkUserExist = await db.query(
          'SELECT * from athletes WHERE email_address = $1;'
        );
        if (checkUserExist.rowCount === 0) {
          try {
            const insertGoogleUser = await db.query(
              `INSERT into athletes (email_address, athlete_name) VALUES ($1, $2);`
            );
            return done(null, insertGoogleUser[0]);
          } catch (err) {
            return done(err);
          }
        }
        return done(null, checkUserExist.rows[0]);
      }
    )
  );

  passport.serializeUser((user, done) => {
    console.log('this is serialize', user._id);
    done(null, user._id); // sends back to client as hash
  });
  passport.deserializeUser((user, done) => {
    //receives hash from client and returns _id
    // db.query('SELECT * from athletes WHERE _id = $1;', [user], (err, res) => {
    //     console.log(res);
    //     if (err) {
    //       return done(err);
    //     } else {
    //       return done(null, res.rows[0]);
    //     }
    //   }
    // );
    // console.log('this is deserialize', user)
    done(null, user);
  });
}

module.exports = initialize;

// module.exports = function (passport) {
//   passport.use(
//     'local-signup',
//     new LocalStrategy({
//       // by default, local strategy uses username and password, we will override with email
//       usernameField: 'email',
//       passwordField: 'password',
//       passReqToCallback: true, // allows us to pass back the entire request to the callback
//     })
//   );
// };

// const passport = require('passport');
// const LocalStrategy = require('passport-local');
// const bcrypt = require('bcrypt');
// const db = require('../database/psqlTables');

// module.exports = {
//   query: (text, params, callback) => {
//     return pool.query(text, params, callback);
//   },
// };
