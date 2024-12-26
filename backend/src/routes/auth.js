const { registerUserController, loginUserController,editUserController } = require("../controllers/authController");
const express = require("express");
const router = express.Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.post("/edit",editUserController)

module.exports = router;
