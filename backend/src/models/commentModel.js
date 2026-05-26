const db = require("../config/db");

const getCommentsByCourse = async (courseId) => {
  const [rows] = await db.query(
    `SELECT cc.id, cc.comment, cc.created_at, u.name
     FROM course_comments cc
     JOIN users u ON u.id = cc.user_id
     WHERE cc.course_id = ?
     ORDER BY cc.created_at DESC`,
    [courseId]
  );
  return rows;
};

const createComment = async ({ course_id, user_id, comment }) => {
  const [result] = await db.query(
    "INSERT INTO course_comments (course_id, user_id, comment) VALUES (?, ?, ?)",
    [course_id, user_id, comment]
  );
  return result.insertId;
};

module.exports = { getCommentsByCourse, createComment };
