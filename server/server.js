const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
require("dotenv").config();

const pg = require('./database/psqlTables');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const { createServer } = require("http");
const { Server } = require("socket.io");
const socketUtil = require("./util/socketUtil.js");

const authRouter = require("./routes/authRoutes");
const postRouter = require("./routes/postRoutes");
const athleteRouter = require("./routes/athleteRoutes");
const searchRouter = require("./routes/searchRoutes");
const subscriptionRouter = require("./routes/subscriptionRoutes");
const conversationRouter = require("./routes/conversationRoutes");
const messageRouter = require("./routes/messageRoutes");

const cors = require("cors");
const cookieParser = require("cookie-parser");

const session = require('express-session');
const passport = require('passport');
require('./config/passport')(passport);

const typeDefs = /* GraphQL */`
  type Like {
    _id: Int
    workout_id: Int
    likedby: Int
  }
  type WorkoutCard {
    _id: Int
    workout_content: String
    date: Int
    workout_title: String
    tag: String
    athlete_id: Int
    CardLikes: [Like!]
  }
  type Athlete {
    _id: Int
    email_address: String
    password: String
    athlete_name: String
    age: Int
  }
  type Query {
    athletes: [Athlete!]
    AthleteByID(_id : Int) : [Athlete!]
    AthleteByName(name: String) : [Athlete!]
    getAllWorkoutCards: [WorkoutCard!]
    getWorkoutCardsByAthleteID(athlete_id: Int): [WorkoutCard!]
    getWorkoutCardsByWorkoutID(_id: Int): [WorkoutCard!]
    getAllLikes: [Like!]
    CardLikes: [Like]
  }
`

const resolvers = {
  Query: {
    athletes: async (parent, args, context, info) => {
      const athletes = await pg.query(`SELECT * FROM athletes;`)
      return athletes.rows;
    },
    AthleteByID: async (root, args) => {
      const values = [args._id]
      const athletebyId = await pg.query(`SELECT * FROM athletes WHERE _id=$1;`, values)
      // return athletebyId.rows.filter((athlete) => athlete._id == args._id);
      return athletebyId.rows;
    },
    AthleteByName: async (root, args) => {
      const { rows: athleteByName } = await pg.query(`SELECT * FROM athletes WHERE athlete_name=$1;`, [args.name])
      // return athleteByName.rows.filter((athlete) => athlete.athlete_name == args.name);
      return athleteByName;
    },
    getAllWorkoutCards: async (parent, args, context, info) => {
      const WorkoutCards = await pg.query(`SELECT * FROM workout_card;`)
      return WorkoutCards.rows;
    },
    getWorkoutCardsByAthleteID: async (root, args) => {
      const WorkoutCards = await pg.query(`SELECT * FROM workout_card WHERE athlete_id=$1;`, [args.athlete_id])
      return WorkoutCards.rows;
    },
    getWorkoutCardsByWorkoutID: async (root, args) => {
      const WorkoutCardsByWorkoutID = await pg.query(`SELECT * FROM workout_card WHERE _id=$1`, [args._id])
      return WorkoutCardsByWorkoutID.rows;
    },
    getAllLikes: async (root, args) => {
      const allLikes = await pg.query(`SELECT * FROM likes;`)
      return allLikes.rows;
    },
  },
  WorkoutCard :{
    CardLikes: async (root, args) => {
      // need to match root._id (workout cards id) to corresponding likes workout_id
      const cardLikes = await pg.query(`SELECT * FROM likes WHERE workout_id=$1;`, [ root._id ])
      return cardLikes.rows;
    },
  }
}

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:8080",
  },
});

app.use(express.json());

app.use(cors({
  credentials: true,
}));

app.use(cookieParser());

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
		cookie: { maxAge: 3600000 }, //this is 1 hour
	})
);

app.use(passport.initialize());
app.use(passport.session());


// app.get("/", (req, res, next) => {
//   return res.status(200).send("the server is working");
// });

app.use('/graphql', graphqlHTTP({
  schema: makeExecutableSchema({typeDefs, resolvers}),
  graphiql: true,
}))
//
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/athlete", athleteRouter, subscriptionRouter);
app.use("/api/search", searchRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/message", messageRouter);

//socket.io setup
io.on("connection", (socket) => {
  //when connected
  console.log("a user is connected", socket.id);

  //displaying online users to all clients
  socket.on("addUser", (userId) => {
    socketUtil.addUser(userId, socket.id);
    io.emit("getUsers", socketUtil.users);
  });

  //send and get messages
  socket.on("sendMessage", ({ senderId, receiverId, message, conversationId }) => {
    const receiver = socketUtil.getUser(receiverId);
    io.to(receiver.socketId).emit("getMessage", { senderId, message, conversationId });
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("user left", socket.id);
    socketUtil.removeUser(socket.id);
    io.emit("getUsers", socketUtil.users);
  });
});

//handle page not found
app.use((req, res) =>
  res.status(404).send("This is not the page you're looking for...")
);

//global error middleware
app.use((err, req, res, next) => {
  console.log('this is err', err);
  const defaultErr = {
    log: "Express error handler caught unknown middleware error",
    status: 500,
    message: { err: "An error occurred" },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

// httpServer.listen(PORT, () => console.log(`Listening at port ${PORT}`));

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = app;