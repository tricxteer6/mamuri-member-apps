const {
  getAllContent,
  getContentByType,
  createContent,
  updateContent,
  deleteContent,
} = require("../models/contentModel");
const { createMessage } = require("../models/contactModel");
const fs = require("fs");
const path = require("path");

const listContent = async (req, res, next) => {
  try {
    const { type } = req.query;
    const data = type ? await getContentByType(type) : await getAllContent();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const addContent = async (req, res, next) => {
  try {
    const id = await createContent(req.body);
    res.status(201).json({ message: "Content created", id });
  } catch (error) {
    next(error);
  }
};

const editContent = async (req, res, next) => {
  try {
    const affected = await updateContent(req.params.id, req.body);
    if (!affected) return res.status(404).json({ message: "Content not found" });
    res.json({ message: "Content updated" });
  } catch (error) {
    next(error);
  }
};

const removeContent = async (req, res, next) => {
  try {
    const affected = await deleteContent(req.params.id);
    if (!affected) return res.status(404).json({ message: "Content not found" });
    res.json({ message: "Content deleted" });
  } catch (error) {
    next(error);
  }
};

const submitContact = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }
    await createMessage({ name, email, message });
    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    next(error);
  }
};

const uploadContentImage = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image file is required" });
    const imageUrl = `/uploads/${req.file.filename}`;
    res.status(201).json({ image_url: imageUrl });
  } catch (error) {
    next(error);
  }
};

const deleteContentImage = async (req, res, next) => {
  try {
    const { image_url } = req.body;
    if (!image_url || !image_url.startsWith("/uploads/")) {
      return res.status(400).json({ message: "Invalid image url" });
    }
    const target = path.join(__dirname, "../../", image_url.replace(/^\//, ""));
    if (fs.existsSync(target)) fs.unlinkSync(target);
    res.json({ message: "Image deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listContent,
  addContent,
  editContent,
  removeContent,
  submitContact,
  uploadContentImage,
  deleteContentImage,
};
