require("dotenv").config({ path: "../.env" });
const { Pool } = require("pg");

const databaseConfig = { connectionString: process.env.DATABASE_URL };

//creating a new pool
const pool = new Pool(databaseConfig);

const queriesRouter = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },

  //gets the uique workouts list (for user has subscription already) from the DB as an array of workout objects
  uniqueWorkoutList: async (req, res, next) => {
    const currentUserId = req.session.passport.user;
    try {
      const query = `SELECT a.athlete_name, w.* FROM workout_card w INNER JOIN athletes a ON w.athlete_id = a._id INNER JOIN subscription s ON w.athlete_id = s.following WHERE s.athlete_id = ${currentUserId} ORDER BY date DESC;`;

      const unique = await pool.query(query);
      if (unique.rows.length === undefined) return next();
      else {
        res.locals.uniqueWorkoutList = unique.rows;
        return next();
      }
    } catch (error) {
      return next({
        log: "error getting uniqueWorkoutList in database",
        message: {
          err: `error received from uniqueWorkoutList query: ${error}`,
        },
      });
    }
  },

  //gets the workouts list from the DB as an array of workout objects
  getWorkoutsList: (req, res, next) => {
    const oldQuery = `SELECT a.athlete_name, w.* 
    FROM workout_card w
    JOIN athletes a
      ON w.athlete_id = a._id
    ORDER BY date DESC;`
    const newQuery = `SELECT a.athlete_name, w.*, l.likedby FROM workout_card w JOIN athletes a ON w.athlete_id = a._id FULL OUTER JOIN likes l ON w._id=l.workout_id ORDER BY date DESC`

    pool
      .query( newQuery )
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
    const athlete_id = req.session.passport.user

    try {
      // const query = `INSERT INTO workout_card (workout_content, date, workout_title, athlete_id) VALUES ('${workout_content}', NOW(), '${workout_title}', '${athlete_id}') RETURNING _id; `;
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

  likeWorkout: async (req, res, next) => {
    const { workout_id, athlete_id } = req.body
    const likeQuery = `INSERT INTO likes (workout_id, likedby) VALUES ($1, $2);`;
    try {
      const likedPost = await pool.query(likeQuery, [ workout_id, athlete_id ])
      res.locals.likedPost = likedPost
      return next();
    } catch (error) {
      return next({
        log: "error liking workout to like table in database",
        message: { err: `error received from likeWorkout query: ${error}` },
      });
    }
  },
  
  unlikeWorkout: async (req, res, next) => {
    try {
      const { workout_id, athlete_id } = req.body;
      const unlikeQuery = `DELETE FROM likes WHERE workout_id=$1 AND likedby=$2;`
      const unlikedPost = await pool.query(unlikeQuery, [ workout_id, athlete_id ])
      console.log('unlikedPost', unlikedPost)
      res.locals.unlikedPost = unlikedPost;
      return next();
    } catch (error) {
      return next({
        log: "error liking workout to like table in database",
        message: { err: `error received from likeWorkout query: ${error}` },
      });
    }
  },

  getWorkout: async (req, res, next) => {
    const { post } = req.params;

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
      let result = {};
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

      res.locals.results = result;
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
    const athleteId = req.query.id; //TO DO this may interfere with teh below code with req.session.passport.user
    console.log(athleteId);
    // const { athleteId } = req.params;
    if (athleteId === undefined) return next({ log: "no athlete_id found" });
    // if (athleteId === undefined) 
      athleteId = req.session.passport.user
    const oldQuery = `SELECT a.athlete_name, w.* FROM workout_card w JOIN athletes a ON w.athlete_id = a._id WHERE a._id = ${athleteId}
    ORDER BY date DESC;`
    const newQuery = `SELECT a.athlete_name, w.*, l.likedby FROM workout_card w JOIN athletes a ON w.athlete_id = a._id FULL OUTER JOIN likes l ON w._id=l.workout_id WHERE w.athlete_id = $1 ORDER BY date DESC;`
    pool
      .query( newQuery, [ athleteId ] )
      .then((workoutsListData) => {
        console.log('in getWorkoutsByAthlete', workoutsListData);
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
    const { athleteId } = req.params;

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
