const bcrypt = require("bcryptjs");
const {
  getUserByEmail,
  getUserById,
  updateUserPassword,
  updateOwnProfile,
} = require("../models/userModel");
const { signToken } = require("../utils/jwt");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await getUserByEmail(normalizedEmail);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Password lama dan password baru wajib diisi" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password baru minimal 6 karakter" });
    }

    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Password lama salah" });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    const affected = await updateUserPassword(user.id, hash);
    if (!affected) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json({ message: "Password berhasil diubah" });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    });
  } catch (error) {
    next(error);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const { name, email } = req.body || {};
    const trimmedName = typeof name === "string" ? name.trim() : "";
    const trimmedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    if (!trimmedName || !trimmedEmail) {
      return res.status(400).json({ message: "Nama dan email wajib diisi" });
    }

    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const existing = await getUserByEmail(trimmedEmail);
    if (existing && existing.id !== user.id) {
      return res.status(409).json({ message: "Email sudah dipakai akun lain" });
    }

    const affected = await updateOwnProfile(user.id, {
      name: trimmedName,
      email: trimmedEmail,
    });
    if (!affected) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const nextUser = {
      id: user.id,
      name: trimmedName,
      email: trimmedEmail,
      role: user.role,
    };
    const token = signToken({
      id: nextUser.id,
      email: nextUser.email,
      role: nextUser.role,
      name: nextUser.name,
    });

    res.json({ token, user: nextUser });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, changePassword, getMe, updateMe };
