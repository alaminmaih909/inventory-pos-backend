const express = require("express");
const {
  signUp,
  verifyOTP,
  reSendOtp,
  userDetails,
  login,
  logOut,
  forgetPasswordReq,
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

router.post("/user/signup", signUp);
router.post("/user/userDetails/:phone", authOTPVerify, userDetails);

 // Otp verify and resend otp
router.post("/user/verify-otp/:phone", verifyOTP);
router.post("/user/resend-otp/:phone",reSendOtp);

router.post("/user/login", authOTPVerify, login);
router.get("/user/logout", authVerify, logOut);

// user forget their password
router.post("/user/forget-password-request", authOTPVerify, forgetPasswordReq);
router.post("/user/newpassword/:phone",authOTPVerify, newPassword);

router.post("/user/change-password", authVerify, changePassword);

// user profile related
router.get("/user/profile", authVerify, getProfile);
router.put("/user/profile/update-profile", authVerify, updateProfile);
router.get("/user/profile/delete-profile-request",authVerify,requestDeleteAccount);
router.delete("/user/profile/delete-profile", authVerify, confirmDeleteProfile);

module.exports = router;
