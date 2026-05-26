const express = require("express");
const {
  listCourses,
  getCourse,
  addCourse,
  editCourse,
  removeCourse,
  listCourseComments,
  addCourseComment,
  uploadCourseThumbnail,
  deleteCourseThumbnail,
} = require("../controllers/courseController");
const { protect, allowRoles } = require("../middleware/authMiddleware");
const { uploadImage } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", listCourses);
router.get("/:id", protect, getCourse);
router.get("/:id/comments", listCourseComments);
router.post("/:id/comments", protect, allowRoles("user"), addCourseComment);
router.post("/upload-thumbnail", protect, allowRoles("admin"), uploadImage.single("image"), uploadCourseThumbnail);
router.delete("/thumbnail", protect, allowRoles("admin"), deleteCourseThumbnail);
router.post("/", protect, allowRoles("admin"), addCourse);
router.put("/:id", protect, allowRoles("admin"), editCourse);
router.delete("/:id", protect, allowRoles("admin"), removeCourse);

module.exports = router;
