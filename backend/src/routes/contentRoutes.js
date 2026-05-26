const express = require("express");
const {
  listContent,
  addContent,
  editContent,
  removeContent,
  submitContact,
  uploadContentImage,
  deleteContentImage,
} = require("../controllers/contentController");
const { protect, allowRoles } = require("../middleware/authMiddleware");
const { uploadImage } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", listContent);
router.post("/contact", submitContact);
router.post("/upload-image", protect, allowRoles("admin"), uploadImage.single("image"), uploadContentImage);
router.delete("/image", protect, allowRoles("admin"), deleteContentImage);
router.post("/", protect, allowRoles("admin"), addContent);
router.put("/:id", protect, allowRoles("admin"), editContent);
router.delete("/:id", protect, allowRoles("admin"), removeContent);

module.exports = router;
