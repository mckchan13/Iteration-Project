require("dotenv").config();
const { Pool } = require("pg");
const databaseConfig = { connectionString: process.env.DATABASE_URL };

const pool = new Pool(databaseConfig);

const messageController = {
  addMessage: async (req, res, next) => {
    const { message, conversationId, senderId } = req.body;
    const params = [message, conversationId, senderId, Date.now()];

    try {
      const query = `
      INSERT INTO message (message, conversation_id, sender_id, date)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

      const message = await pool.query(query, params);

      res.locals.message = message.rows[0];

      return next();
    } catch (error) {
      return next({
        log: "error adding message to message table in database",
        message: { err: `error received from addmessage query: ${error}` },
      });
    }
  },

  getMessage: async (req, res, next) => {
    const { conversationId } = req.query;

    try {
      const query = `SELECT *
        FROM message
        WHERE conversation_id = ${conversationId}`;

      const message = await pool.query(query);
      res.locals.message = message.rows;
      return next();
    } catch (error) {
      return next({
        log: "error fetching message from message table in database",
        message: { err: `error received from getMessage query: ${error}` },
      });
    }
  },
};

module.exports = messageController;
