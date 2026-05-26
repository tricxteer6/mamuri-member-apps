const db = require("../config/db");

const createUser = async ({ name, email, password, role = "user" }) => {
  const [result] = await db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, password, role]
  );
  return result.insertId;
};

const getUserByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};

const getAllUsers = async () => {
  const [rows] = await db.query(
    "SELECT id, name, email, role, created_at FROM users ORDER BY id DESC"
  );
  return rows;
};

const updateUser = async (id, payload) => {
  const [result] = await db.query(
    "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?",
    [payload.name, payload.email, payload.role, id]
  );
  return result.affectedRows;
};

const deleteUser = async (id) => {
  const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
  return result.affectedRows;
};

const getUserById = async (id) => {
  const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
};

const updateUserPassword = async (id, passwordHash) => {
  const [result] = await db.query("UPDATE users SET password = ? WHERE id = ?", [
    passwordHash,
    id,
  ]);
  return result.affectedRows;
};

const updateOwnProfile = async (id, { name, email }) => {
  const [result] = await db.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [
    name,
    email,
    id,
  ]);
  return result.affectedRows;
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  getAllUsers,
  updateUser,
  updateUserPassword,
  updateOwnProfile,
  deleteUser,
};
