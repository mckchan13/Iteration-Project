const db = require('../database/psqlTables');
const bcrypt = require('bcrypt');

const signupController = {};

const signupQuery = `INSERT into athletes (email_address, password, athlete_name, age)
VALUES( $1, $2, $3, $4)`;

const checkDuplicatesQuery = `SELECT * from athletes WHERE email_address = $1;`;

signupController.getSignupData = async (req, res, next) => {
  try {
    // const { email_address, password, athlete_name, age } = req.body;
    let userDataArray = Object.values(req.body);
    const userData = await db.query(checkDuplicatesQuery, [
      req.body.email_address,
    ]);
    console.log('this is rowcount', userData.rowCount);
    if (userData.rowCount === 0) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      // console.log(hashedPassword);
      userDataArray[1] = hashedPassword;
      const signupData = await db.query(signupQuery, userDataArray);
      // console.log('this is signup data', signupData);
      return next();
    } else {
      return next({
        log: `signupController.getSignupData error: duplicate`,
        status: 409,
        message: { error: `Email is already registered` },
      });
    }
    // console.log('this is reqbody', req.body);
    // const signupData = await db.query(signupQuery);
    // const signupData = await db.query(insertQuery, array);
    // console.log(res.rows[0]);
    // console.log('this is signupData', signupData);
  } catch (err) {
    return next({
      log: `signupController.getSignupData error: ${err}`,
      status: 500,
      message: { err: `signupController.getSignupData error: ${err}` },
    });
  }
};

signupController.checkAuth = (req, res, next) => {
  try {
    console.log("!!!!!!!!s" + req.session.passport)
    if (req.session && req.session.passport && req.session.passport.user) {
      return next()
    } else {
      return next({
        log: `signupController.checkAuth error: user is not authorized`,
        status: 401,
        message: { error: `User is not authorized` },
      });
    }
  } catch (err) {
    return next({
      log: `signupController.checkAuth error: ${err}`,
      status: 500,
      message: { err: `signupController.checkAuth error: ${err}` },
    });
  }
}

module.exports = signupController;
