require("dotenv").config({ path: "../.env" });
const { Pool } = require("pg");

const databaseConfig = { connectionString: process.env.DATABASE_URL };

//creating a new pool
const pool = new Pool(databaseConfig);

// pool.query("SELECT NOW()", (err, res) => {
//   console.log(`error: ${err}`);
//   console.log(`response: ${JSON.parse(JSON.stringify(res))}`);
//   console.log("Starting...");
//   console.log(err, res);
//   pool.end();
// });

const queriesRouter = {
  query: (text, params, callback) => {
    console.log("executed query", text);
    return pool.query(text, params, callback);
  },

  //gets the workouts list from the DB as an array of workout objects
  getWorkoutsList: (req, res, next) => {
    pool
      .query(
        `SELECT a.athlete_name, w.* 
              FROM workout_card w
              JOIN athletes a
                ON w.athlete_id = a._id
              ORDER BY date DESC;`
      )
      .then((workoutsListData) => {
        if (!workoutsListData) return next({ log: "no workouts found" });
        res.locals.workoutsList = workoutsListData.rows;
        return next();
      })
      .catch((err) =>
        next({
          log: "error retrieving workoutsList from database",
          message: { err: `error received from workoutsList query: ${err}` },
        })
      );
  },

  //takes in athlete_id & workout_content from req.body and queries to add
  //entry to workout_card table in the database

  postWorkout: async (req, res, next) => {
    const { athlete_id, workout_content, workout_title } = req.body;
    // console.log(athlete_id, workout_content, workout_title);

    try {
      const query = `INSERT INTO workout_card (workout_content, date, workout_title, athlete_id, vector) VALUES ('${workout_content}', NOW(), '${workout_title}', '${athlete_id}', to_tsvector('${workout_content}')) RETURNING _id; `;

      const post = await pool.query(query);
      res.locals.post = post.rows[0]._id;
      return next();
    } catch (error) {
      return next({
        log: "error posting workout to workout_card table in database",
        message: { err: `error received from postWorkout query: ${error}` },
      });
    }
  },

  getWorkout: async (req, res, next) => {
    const { post } = req.params;
    // console.log(athlete_id, workout_content, workout_title);

    try {
      const query = `SELECT *
        FROM workout_card
        WHERE _id = ${postId}`;

      const post = await pool.query(query);
      res.locals.post = post.rows[0];
      return next();
    } catch (error) {
      return next({
        log: "error getting workout to workout_card table in database",
        message: { err: `error received from getWorkout query: ${error}` },
      });
    }
  },

  getSearchResult: async (req, res, next) => {
    const { search } = req.query;

    try {
      let result = {}
      const query1 = `SELECT *
        FROM workout_card
        WHERE vector @@ to_tsquery('${search}')`;
      
      const query2 = `SELECT *
        FROM athletes
        WHERE athlete_name ILIKE '%${search}%'`;
      
      const query3 = `SELECT *
        FROM tag
        WHERE tag ILIKE '%${search}%'`;

      const workoutResult = await pool.query(query1);
      const athleteResult = await pool.query(query2);
      const tagResult = await pool.query(query3);
      result.workout = workoutResult.rows[0];
      result.athlete = athleteResult.rows[0];
      result.tag = tagResult.rows[0];
      
      res.locals.results = result
      return next();
    } catch (error) {
      return next({
        log: "error getting athlete to athletes table in database",
        message: {
          err: `error received from getAthleteBySearch query: ${error}`,
        },
      });
    }
  },

  //gets the workouts list from the DB as an array of workout objects
  getWorkoutsByAthlete: (req, res, next) => {
    const athleteId = req.query.id;
    console.log(athleteId);

    if (athleteId === undefined) return next({ log: "no athlete_id found" });

    pool
      .query(
        `SELECT a.athlete_name, w.* 
              FROM workout_card w
              JOIN athletes a
                ON w.athlete_id = a._id
                WHERE a._id = ${athleteId}
              ORDER BY date DESC;`
      )
      .then((workoutsListData) => {
        // console.log(workoutsListData);
        if (!workoutsListData.rows[0])
          return next({ log: "no workouts found for this athlete" });
        res.locals.workoutsList = workoutsListData.rows;
        return next();
      })
      .catch((err) =>
        next({
          log: "error retrieving workoutsList of this athlete from database",
          message: {
            err: `error received from workoutsList by athlete query: ${err}`,
          },
        })
      );
  },

  //gets the athlete info from the DB (just the name to start with)
  getAthleteInfo: (req, res, next) => {
    const athleteId = req.query.id;

    if (athleteId === undefined) return next({ log: "no athlete_id found" });

    pool
      .query(
        `SELECT athlete_name 
        FROM athletes 
        WHERE _id = ${athleteId};`
      )
      .then((dbResponse) => {
        if (!dbResponse.rows[0]) {
          return next({ log: "no athlete found with this id" });
        }
        // console.log(dbResponse.rows[0].athlete_name);
        res.locals.athleteName = dbResponse.rows[0].athlete_name;
        return next();
      })
      .catch((err) =>
        next({
          log: "error retrieving name of this athlete from database",
          message: {
            err: `error received from athlete info query by athlete id: ${err}`,
          },
        })
      );
  },

  postTag: async (req, res, next) => {
    const { athlete_id, workout_id, tag } = req.body;
    console.log(athlete_id, workout_id, tag);
    try {
      const query = `INSERT INTO tag (workout_id, tag, athlete_id) VALUES ('${workout_id}', '${tag}', '${athlete_id}') RETURNING _id`;

      const post = await pool.query(query);
      res.locals.tag = post.rows[0]._id;
      return next();
    } catch (error) {
      return next({
        log: "error posting workout to tag table in database",
        message: { err: `error received from postTag query: ${error}` },
      });
    }
  },
};

module.exports = queriesRouter;
