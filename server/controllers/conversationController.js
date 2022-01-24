require("dotenv").config();
const { Pool } = require("pg");
const databaseConfig = { connectionString: process.env.DATABASE_URL };

const pool = new Pool(databaseConfig);

const conversationController = {
  addConversation: async (req, res, next) => {
    const { senderId, receiverId } = req.body;
    const params = [senderId, receiverId];

    try {
      const query = `
      INSERT INTO conversation (sender_id, receiver_id)
      VALUES ($1, $2)
      RETURNING *
    `;

      const conv = await pool.query(query, params);
      res.locals.conversation = conv.rows[0];
      return next();
    } catch (error) {
      return next({
        log: "error adding conversation to conversation table in database",
        message: { err: `error received from addConversation query: ${error}` },
      });
    }
  },

  getConversation: async (req, res, next) => {
    const { userId } = req.query;

    try {
      const query = `SELECT *
        FROM conversation
        WHERE sender_id = ${userId} OR receiver_id = ${userId}`;

      const conv = await pool.query(query);

      res.locals.conversation = conv.rows;
      return next();
    } catch (error) {
      return next({
        log: "error fetching conversation from conversation table in database",
        message: { err: `error received from getConversation query: ${error}` },
      });
    }
  },

  getOneConversation: async (req, res, next) => {
    const { user1Id, user2Id } = req.query;

    try {
      const query1 = `SELECT *
        FROM conversation
        WHERE sender_id = ${user1Id} AND receiver_id=${user2Id}`;
      
      const query2 = `SELECT *
        FROM conversation
        WHERE sender_id = ${user2Id} AND receiver_id=${user1Id}`;

      const conv1 = await pool.query(query1);
      const conv2 = await pool.query(query2);

      if (conv1.rows.length > 0) {
        res.locals.conversation = conv1.rows;
      } else{res.locals.conversation = conv2.rows;}

      return next();
    } catch (error) {
      return next({
        log: "error fetching conversation from conversation table in database",
        message: { err: `error received from getConversation query: ${error}` },
      });
    }
  },
};

module.exports = conversationController;
