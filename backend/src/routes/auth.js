const { registerUserController, loginUserController,editUserController,getUserInfoController } = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { loginRateLimiter, signupRateLimiter } = require("../middleware/rateLimitMiddleware");
const express = require("express");
const router = express.Router();

router.post("/register", signupRateLimiter,registerUserController);
router.post("/login",loginRateLimiter ,loginUserController);
router.put("/edit",authenticateToken,editUserController)
router.get("/user",authenticateToken,getUserInfoController)

module.exports = router;
