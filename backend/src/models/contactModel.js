const db = require("../config/db");

const createMessage = async ({ name, email, message }) => {
  const [result] = await db.query(
    "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)",
    [name, email, message]
  );
  return result.insertId;
};

module.exports = { createMessage };
