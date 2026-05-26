const db = require("../config/db");

const getAllContent = async () => {
  const [rows] = await db.query("SELECT * FROM content ORDER BY id DESC");
  return rows;
};

const getContentByType = async (type) => {
  const [rows] = await db.query(
    "SELECT * FROM content WHERE type = ? ORDER BY id DESC",
    [type]
  );
  return rows;
};

const createContent = async ({ type, title, body }) => {
  const [result] = await db.query(
    "INSERT INTO content (type, title, body) VALUES (?, ?, ?)",
    [type, title, body]
  );
  return result.insertId;
};

const updateContent = async (id, payload) => {
  const [result] = await db.query(
    "UPDATE content SET type = ?, title = ?, body = ? WHERE id = ?",
    [payload.type, payload.title, payload.body, id]
  );
  return result.affectedRows;
};

const deleteContent = async (id) => {
  const [result] = await db.query("DELETE FROM content WHERE id = ?", [id]);
  return result.affectedRows;
};

module.exports = {
  getAllContent,
  getContentByType,
  createContent,
  updateContent,
  deleteContent,
};
