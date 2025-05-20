const cron = require("node-cron");
const User = require("../models/userModel");

// প্রতি মিনিটে একবার চেক করবে যাদের otpExpires অতীত হয়ে গেছে
cron.schedule("* * * * *", async () => {
  try {
    const result = await User.updateMany(
      {
        otpExpires: { $lt: new Date() },
        isVerified: false
      },
      {
        $set: { otp: null, otpExpires: null }
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`⏰ Expired OTP cleaned: ${result.modifiedCount} users`);
    }
  } catch (error) {
    console.error("Cron job error:", error);
  }
});
