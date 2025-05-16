// Simple OTP generator (6 digit)
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};



 // Simulate SMS sending

const sendOTPBySMS = async (phone, otp) => {
  console.log(`📲 Sending OTP ${otp} to phone number: ${phone}`);
  // In real case, integrate with Twilio / Fast2SMS / bKash API
};

module.exports= {
   generateOTP,sendOTPBySMS 
}