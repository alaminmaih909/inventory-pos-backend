const express = require("express");
const {
  signUp,
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
router.post("/user/details/:phone", authOTPVerify, userDetails);

router.post("/user/login", authOTPVerify, login);
router.get("/user/logout", authVerify, logOut);

// user forget their password
router.post("/user/forget-password-request", authOTPVerify, forgetPasswordReq);
router.post("/user/new-password/:phone",authOTPVerify, newPassword);

router.post("/user/change-password", authVerify, changePassword);

// user profile related
router.get("/user/profile", authVerify, getProfile);
router.put("/user/update-profile", authVerify, updateProfile);
router.get("/user/delete-user-request",authVerify,requestDeleteAccount);
router.delete("/user/delete-profile", authVerify, confirmDeleteProfile);

module.exports = router;
