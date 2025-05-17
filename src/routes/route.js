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
  getProfile,
  updateProfile,
  requestDeleteAccount,
 
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

router.post("user/forgetPasswordReq/:phone",authOTPVerify,forgetPasswordReq);
router.post("user/forgetPassword/otpverify", forgetPasswordOtpVerify);
router.post("user/newpassword",newPassword)

router.get("user/profile", authVerify, getProfile);
router.put("user/profile/:id", authVerify, updateProfile);
router.get("user/profile/:id", authVerify, requestDeleteAccount);


module.exports = router;
