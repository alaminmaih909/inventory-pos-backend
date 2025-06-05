const {verifyOTPService,reSendOtpService} = require("../services/otpService")


// verify user with OTP
exports.verifyOTP = async (req, res) => {
  await verifyOTPService(req, res);
};

//reSend Otp 

exports.reSendOtp = async (req,res) => {
   await reSendOtpService (req,res);
}
