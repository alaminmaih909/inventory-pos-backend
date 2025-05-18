// Simple OTP generator (6 digit)
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Simulate SMS sending

const sendOTPBySMS = async (phone, otp) => {
  console.log(`📲 Sending OTP ${otp} to phone number: ${phone}`);
  // In real case, integrate with Twilio / Fast2SMS / bKash API
};

// utils/sendSMS.js

const sendSMS = async ({ to, message }) => {
  // Simulate SMS send (In real project use Twilio, Fast2SMS, etc.)
  console.log(`📲 Sending SMS to ${to}: ${message}`);
  // Example for Twilio (if used):
  // await twilioClient.messages.create({
  //   body: message,
  //   from: YOUR_TWILIO_PHONE,
  //   to,
  // });
};

module.exports = {
  generateOTP,
  sendOTPBySMS,
  sendSMS,
};
