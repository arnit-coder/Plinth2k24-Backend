const express = require("express");
const router = express.Router();

const { login, signUp, sendotp, loginWithNumber } = require("../controllers/Auth");
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword");

router.post("/signup", signUp);
router.post("/login", login);
router.post("/loginWithNumber", loginWithNumber);
router.post("/sendOtp", sendotp)

router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetPassword);


module.exports = router;
