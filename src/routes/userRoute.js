const express = require("express");
const {
  signUp,
  verifyOTP,
  userDetails,
  login,
  logOut,
  forgetPasswordReq,
  forgetPasswordOtpVerify,
  newPassword,
  changePassword,
  getProfile,
  updateProfile,
  requestDeleteAccount,
  confirmDeleteProfile,
} = require("../controllers/userController");

const { authVerify } = require("../middlwares/authVerify");
const { authOTPVerify } = require("../middlwares/authVerifiedCheck");

const router = express.Router();

// User Account related routes

router.post("user/signup", signUp);
router.post("user/verifyOTP", verifyOTP);
router.post("user/userDetails", authOTPVerify, userDetails);

router.post("user/login", authOTPVerify, login);
router.post("user/logout", authVerify, logOut);

// user forget their password
router.post("user/forgetPasswordReq", authOTPVerify, forgetPasswordReq);
router.post("user/forgetPassword/otpverify", forgetPasswordOtpVerify);
router.post("user/newpassword", newPassword);

router.post("user/changePassword", authVerify, changePassword);

// user profile related
router.get("user/profile", authVerify, getProfile);
router.put("user/profile/updateProfile", authVerify, updateProfile);
router.get("user/profile/deleteProfilerRequest",authVerify,requestDeleteAccount);
router.delete("user/profile/deleteProfile", authVerify, confirmDeleteProfile);

module.exports = router;
