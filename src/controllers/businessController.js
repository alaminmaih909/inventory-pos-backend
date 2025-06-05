const {
  createBusinessService,
  getAllBusinessService,
  getBusinessService,
  dashboardService,
  updateBusinessService,
  deleteBusinessReqService,
  deleteBusinessService,
} = require("../services/businessService");

// create a new business
exports.createBusiness = async (req, res) => {
  await createBusinessService(req, res);
};

// get All Business
exports.getAllBusiness = async (req, res) => {
  await getAllBusinessService(req, res);
};

// get a single Business
exports.getBusiness = async (req, res) => {
  await getBusinessService(req, res);
};

// dashboard business
exports.dashboard = async (req, res) => {
  await dashboardService(req, res);
};

// update business data
exports.updateBusiness = async (req, res) => {
  await updateBusinessService(req, res);
};

// business delete request
exports.deleteBusinessReq = async (req, res) => {
  await deleteBusinessReqService(req, res);
};

// delete Business confirm
exports.deleteBusiness = async (req, res) => {
  await deleteBusinessService(req, res);
};
