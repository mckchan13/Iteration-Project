require("dotenv").config({ path: "../.env" });
const { Pool } = require("pg");

const databaseConfig = { connectionString: process.env.DATABASE_URL };

//creating a new pool
const pool = new Pool(databaseConfig);

const subcriptionRouter = {
  query: (text, params, callback) => {
    console.log("executed query", text);
    return pool.query(text, params, callback);
  },

  //first query to check if the is relationship exit
  relationship: async (req, res, next) => {
    const { currentAthletePageId, currentUserId } = req.body;
    try {
      const query = `SELECT _id FROM subscription WHERE athlete_id = '${currentUserId}' AND following = '${currentAthletePageId}';`;
      const checking = await pool.query(query);
      // console.log("this is the value of checking", checking);
      if (checking["rowCount"]) {
        res.locals.followingStatus = "Following";
      } else res.locals.followingStatus = "Follow";
      return next();
    } catch (error) {
      return next({
        log: "error relationship subcription into the database",
        message: { err: `error received from relationship query: ${err}` },
      });
    }
  },

  //Insert subcription into the subcription table
  addFollower: async (req, res, next) => {
    const { currentAthletePageId, currentUserId } = req.body;
    console.log(
      `is log in as ${currentUserId} is trying to follow ${currentAthletePageId}`
    );
    try {
      console.log("insert query to subscription table...");
      const query = `INSERT INTO subscription (athlete_id, following) VALUES ('${currentUserId}', '${currentAthletePageId}') RETURNING _id;`;
      const insert = await pool.query(query);
      console.log(insert);
      return next();
    } catch (error) {
      return next({
        log: "error insert subcription into the database",
        message: { err: `error received from addFollower query: ${err}` },
      });
    }
  },

  //Remove subcription into the subcription table
  deleteFollower: async (req, res, next) => {
    const { currentAthletePageId, currentUserId } = req.body;
    console.log(
      `is log in as ${currentUserId} is trying to follow ${currentAthletePageId}`
    );
    try {
      console.log("delete query to subscription table...");
      const query = `DELETE FROM subscription WHERE athlete_id='${currentUserId}' AND following='${currentAthletePageId}' RETURNING *;`;
      const drop = await pool.query(query);
      console.log(drop);
      return next();
    } catch (error) {
      return next({
        log: "error deleteing subcription into the database",
        message: { err: `error received from deleteFollower query: ${err}` },
      });
    }
  },
};

module.exports = subcriptionRouter;
