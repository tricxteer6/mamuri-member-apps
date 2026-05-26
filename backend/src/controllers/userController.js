const bcrypt = require("bcryptjs");
const {
  createUser,
  getUserByEmail,
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../models/userModel");

const addUser = async (req, res, next) => {
  try {
    const { name, email, password, role = "user" } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const exists = await getUserByEmail(email);
    if (exists) return res.status(409).json({ message: "Email already used" });

    const hash = await bcrypt.hash(password, 10);
    const id = await createUser({ name, email, password: hash, role });
    res.status(201).json({ message: "User created", id });
  } catch (error) {
    next(error);
  }
};

const listUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const editUser = async (req, res, next) => {
  try {
    const affected = await updateUser(req.params.id, req.body);
    if (!affected) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated" });
  } catch (error) {
    next(error);
  }
};

const removeUser = async (req, res, next) => {
  try {
    const affected = await deleteUser(req.params.id);
    if (!affected) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { addUser, listUsers, editUser, removeUser };
