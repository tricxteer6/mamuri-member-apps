const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../models/courseModel");
const { getCommentsByCourse, createComment } = require("../models/commentModel");
const fs = require("fs");
const path = require("path");

const listCourses = async (req, res, next) => {
  try {
    const courses = await getAllCourses();
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

const getCourse = async (req, res, next) => {
  try {
    const course = await getCourseById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (error) {
    next(error);
  }
};

const addCourse = async (req, res, next) => {
  try {
    const id = await createCourse(req.body);
    res.status(201).json({ message: "Course created", id });
  } catch (error) {
    next(error);
  }
};

const editCourse = async (req, res, next) => {
  try {
    const affected = await updateCourse(req.params.id, req.body);
    if (!affected) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course updated" });
  } catch (error) {
    next(error);
  }
};

const removeCourse = async (req, res, next) => {
  try {
    const affected = await deleteCourse(req.params.id);
    if (!affected) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted" });
  } catch (error) {
    next(error);
  }
};

const listCourseComments = async (req, res, next) => {
  try {
    const comments = await getCommentsByCourse(req.params.id);
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

const addCourseComment = async (req, res, next) => {
  try {
    const { comment } = req.body;
    if (!comment) return res.status(400).json({ message: "Comment is required" });
    const id = await createComment({
      course_id: req.params.id,
      user_id: req.user.id,
      comment,
    });
    res.status(201).json({ message: "Comment added", id });
  } catch (error) {
    next(error);
  }
};

const uploadCourseThumbnail = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image file is required" });
    const thumbnail = `/uploads/${req.file.filename}`;
    res.status(201).json({ thumbnail });
  } catch (error) {
    next(error);
  }
};

const deleteCourseThumbnail = async (req, res, next) => {
  try {
    const { thumbnail } = req.body;
    if (!thumbnail || !thumbnail.startsWith("/uploads/")) {
      return res.status(400).json({ message: "Invalid thumbnail url" });
    }
    const target = path.join(__dirname, "../../", thumbnail.replace(/^\//, ""));
    if (fs.existsSync(target)) fs.unlinkSync(target);
    res.json({ message: "Thumbnail deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listCourses,
  getCourse,
  addCourse,
  editCourse,
  removeCourse,
  listCourseComments,
  addCourseComment,
  uploadCourseThumbnail,
  deleteCourseThumbnail,
};
