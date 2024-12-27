const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Hash a password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Compare a password with the hashed version
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Verify JWT token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { hashPassword, comparePassword, generateToken, verifyToken };
