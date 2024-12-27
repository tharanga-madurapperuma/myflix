const { registerUserController, loginUserController,editUserController,getUserInfoController } = require("../controllers/authController");
const express = require("express");
const router = express.Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.put("/edit",editUserController)
router.get("/user",getUserInfoController)

module.exports = router;
