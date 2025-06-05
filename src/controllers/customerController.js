const {
  createCustomerService,
  getCustomersService,
  getCustomerService,
  updateCustomerService,
  deleteCustomerService,
  getDueCustomersService,
  getTopCustomersService,
} = require("../services/customerServices");

// create customer
exports.createCustomer = async (req, res) => {
  await createCustomerService(req, res);
};

//get Customers
exports.getCustomers = async (req, res) => {
  await getCustomersService(req, res);
};

//get a Customer
exports.getCustomer = async (req, res) => {
  await getCustomerService(req, res);
};

//update Customer
exports.updateCustomer = async (req, res) => {
  await updateCustomerService(req, res);
};

//delete Customer
exports.deleteCustomer = async (req, res) => {
  await deleteCustomerService(req, res);
};

// get due customer
exports.getDueCustomers = async (req, res) => {
  await getDueCustomersService(req, res);
};

// get top customer
exports.getTopCustomers = async (req, res) => {
  await getTopCustomersService(req, res);
};
