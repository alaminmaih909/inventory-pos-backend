const {
  signUpUserService,
  verifyOTPService,
  reSendOtpService,
  userDetailsService,
  loginUserService,
  logoutUserService,
  forgetPasswordReqService,
  newPasswordService,
  changePasswordService,
  getProfileService,
  updateProfileService,
  requestAccountDeletionService,
  confirmAccountDeletionService,
} = require("../services/userService");

// sign up controller
exports.signUp = async (req, res) => {
  await signUpUserService(req, res);
};

// Post user details
exports.userDetails = async (req, res) => {
  await userDetailsService(req, res);
};

// login user phone and password
exports.login = async (req, res) => {
  await loginUserService(req, res);
};

// logout user
exports.logOut = async (req, res) => {
  await logoutUserService(req, res);
};

// User Forget password
exports.forgetPasswordReq = async (req, res) => {
  await forgetPasswordReqService(req, res);
};

// set new password after forget verify
exports.newPassword = async (req, res) => {
  await newPasswordService(req, res);
};

// user change Password
exports.changePassword = async (req,res) => {
   await changePasswordService (req,res);
}

// See user their profile
exports.getProfile = async (req, res) => {
  await getProfileService(req, res);
};

// update user profile
exports.updateProfile = async (req, res) => {
  await updateProfileService(req, res);
};

// delete user account request
exports.requestDeleteAccount = async (req, res) => {
  await requestAccountDeletionService(req, res);
};

// Confirm delete user account
exports.confirmDeleteProfile = async (req, res) => {
  await confirmAccountDeletionService(req, res);
};
