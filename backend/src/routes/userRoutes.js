const express = require("express");
const { addUser, listUsers, editUser, removeUser } = require("../controllers/userController");
const { protect, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, allowRoles("admin"));
router.post("/", addUser);
router.get("/", listUsers);
router.put("/:id", editUser);
router.delete("/:id", removeUser);

module.exports = router;
