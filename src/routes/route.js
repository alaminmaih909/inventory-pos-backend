const express = require("express");
const {
  signUp,
  verifyOTP,
  userDetails,
  login,
  getProfile,
  updateProfile,
  requestDeleteAccount,
  logOut,
} = require("../controllers/userController");

const { authVerify } = require("../middlwares/authVerify");
const {authOTPVerify} = require("../middlwares/authOTPverify")

const router = express.Router();

// User Account related routes
router.post("user/signup", signUp);
router.post("user/verifyOTP", verifyOTP)
router.post("user/userDetails",authOTPVerify, userDetails);

router.post("user/login",authOTPVerify, login);
router.post("user/logout", authVerify, logOut);


router.get("user/profile", authVerify, getProfile);
router.put("user/profile/:id", authVerify, updateProfile);
router.get("user/profile/:id", authVerify, requestDeleteAccount);


module.exports = router;
