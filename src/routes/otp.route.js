const express = require("express");
const router = express.Router();
const { verifyOTP, reSendOtp } = require("../controllers/otpController");

// Otp verify and resend otp
router.post("/user/verify-otp/:phone", verifyOTP);
router.post("/user/resend-otp/:phone", reSendOtp);


module.exports = router;
