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
      RETURNING _id
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
        WHERE sender_id = ${userId}`;

      const conv = await pool.query(query);
      res.locals.conversation = conv.rows[0];
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
