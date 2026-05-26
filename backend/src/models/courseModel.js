const db = require("../config/db");

const getAllCourses = async () => {
  const [rows] = await db.query("SELECT * FROM courses ORDER BY id DESC");
  return rows;
};

const getCourseById = async (id) => {
  const [rows] = await db.query("SELECT * FROM courses WHERE id = ?", [id]);
  return rows[0];
};

const createCourse = async ({ title, description, thumbnail, video_url }) => {
  const [result] = await db.query(
    "INSERT INTO courses (title, description, thumbnail, video_url) VALUES (?, ?, ?, ?)",
    [title, description, thumbnail, video_url]
  );
  return result.insertId;
};

const updateCourse = async (id, payload) => {
  const [result] = await db.query(
    "UPDATE courses SET title = ?, description = ?, thumbnail = ?, video_url = ? WHERE id = ?",
    [payload.title, payload.description, payload.thumbnail, payload.video_url, id]
  );
  return result.affectedRows;
};

const deleteCourse = async (id) => {
  const [result] = await db.query("DELETE FROM courses WHERE id = ?", [id]);
  return result.affectedRows;
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
