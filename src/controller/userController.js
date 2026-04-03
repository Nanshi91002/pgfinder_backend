const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mailSend = require("../utils/MailUtil");
const secret = "secret";

const allowedRoles = ["user", "owner", "admin"];

const sanitizeUser = (userDoc) => {
  const user = userDoc.toObject ? userDoc.toObject() : { ...userDoc };
  delete user.password;
  return user;
};

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role = "user" } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const savedUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    const safeUser = sanitizeUser(savedUser);
    const token = jwt.sign(
      {
        _id: safeUser._id,
        email: safeUser.email,
        role: safeUser.role,
      },
      secret,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully`,
      user: safeUser,
      data: safeUser,
      token,
    });
  } catch (err) {
    console.error("register error", err);
    res.status(500).json({
      message: err.code === 11000 ? "Email is already registered" : "Error creating user",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const safeUser = sanitizeUser(foundUser);
    const token = jwt.sign(
      {
        _id: safeUser._id,
        email: safeUser.email,
        role: safeUser.role,
      },
      secret,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login success",
      user: safeUser,
      token,
    });
  } catch (err) {
    console.error("login error", err);
    res.status(500).json({ message: "Error logging in" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const temporaryPassword = crypto.randomBytes(4).toString("hex");
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    foundUser.password = hashedPassword;
    await foundUser.save();

    await mailSend(
      email,
      "PG Finder temporary password",
      `<div style="font-family:Arial,sans-serif;line-height:1.6">
        <h2>PG Finder password reset</h2>
        <p>Hello ${foundUser.firstName || "User"},</p>
        <p>Your temporary password is:</p>
        <p style="font-size:20px;font-weight:700;letter-spacing:1px">${temporaryPassword}</p>
        <p>Please log in with this password and change it after signing in.</p>
      </div>`
    );

    return res.status(200).json({
      message: "A temporary password has been sent to your email",
    });
  } catch (err) {
    console.error("forgot password error", err);
    return res.status(500).json({ message: "Error sending reset email" });
  }
};

module.exports = { registerUser, loginUser, forgotPassword };
