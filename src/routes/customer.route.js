const express = require("express");
const router = express.Router();

const {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  getDueCustomers,
  getTopCustomers,
} = require("../controllers/customerController");

// middleware
const { authVerify } = require("../middlwares/authVerify");
const { businessChecker } = require("../middlwares/businessChecker");

router.post("/customer", authVerify, businessChecker, createCustomer); // create a customer
router.get("/customers",authVerify,businessChecker, getCustomers); // Get customers with search, filter, pagination
router.get("/customer/:phone",authVerify,businessChecker, getCustomer); // find a single customer
router.put("/customer/:id",authVerify,businessChecker, updateCustomer); // update customer data
router.delete("/customer/:id",authVerify,businessChecker, deleteCustomer); // delete customer

router.get("/customers/due",authVerify,businessChecker, getDueCustomers); // get due customers
router.get("/customers/top",authVerify,businessChecker, getTopCustomers); // get top customers

module.exports = router;
