const {
  signUpUserService,
  verifyOTPService,
  userDetailsService,
  loginUserService,
  logoutUserService,
  getProfileService,
  updateProfileService,
  requestAccountDeletionService,
  confirmAccountDeletionService,
} = require("../services/userService");

// sign up controller
exports.signUp = async (req, res) => {
  await signUpUserService(req, res);
};

// verify user with OTP
exports.verifyOTP = async (req,res) => {
  await verifyOTPService(req,res);
}

// Post user details 
exports.userDetails = async (req,res) => {
  await userDetailsService(req,res);
}

// login user phone and password
exports.login = async (req, res) => {
  await loginUserService(req, res);
};

// logout user 
exports.logOut = async (req, res) => {
  await logoutUserService(req, res);
};

// See user their profile 
exports.getProfile = async (req, res) => {
  await getProfileService(req, res);
};

exports.updateProfile = async (req, res) => {
  await updateProfileService(req, res);
};

exports.requestDeleteAccount = async (req, res) => {
  await requestAccountDeletionService(req, res);
};

exports.confirmDeleteAccount = async (req, res) => {
  await confirmAccountDeletionService(req, res);
};
