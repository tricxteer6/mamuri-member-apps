const express = require("express");
const { login, changePassword, getMe, updateMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", login);
router.get("/me", protect, getMe);
router.patch("/me", protect, updateMe);
router.post("/change-password", protect, changePassword);

module.exports = router;
