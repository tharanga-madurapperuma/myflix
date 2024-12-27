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
  try {
    return jwt.verify(token, process.env.JWT_SECRET); // Verifies the token and decodes it
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};

// Decode JWT token and get user id (with verification)
const decodeToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify and decode token
    return decoded.id; // Return the user id from the decoded token
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};

module.exports = { hashPassword, comparePassword, generateToken, verifyToken, decodeToken };
