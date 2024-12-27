const { registerUserController, loginUserController,editUserController,getUserInfoController } = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.put("/edit",authenticateToken,editUserController)
router.get("/user",authenticateToken,getUserInfoController)

module.exports = router;
