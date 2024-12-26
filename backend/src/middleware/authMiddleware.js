const { verifyToken } = require("../Utils/authUtils");

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = verifyToken(token); // Use utility to verify token
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Forbidden" });
  }
};

const authorizeRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};

module.exports = { authenticateToken, authorizeRole };
