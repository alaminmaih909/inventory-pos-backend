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

const { authverify } = require("../middlwares/authVerify");
const { businessChecker } = require("../middlwares/businessChecker");

router.post("/customer", authverify, businessChecker, createCustomer); // create a customer
router.get("/customers", getCustomers); // Get customers with search, filter, pagination
router.get("/customer/:phone", getCustomer); // find a single customer
router.put("/customer/:id", updateCustomer); // update customer data
router.delete("/customer/:id", deleteCustomer); // delete customer

router.get("/customers/due", getDueCustomers); // get due customers
router.get("/customers/top", getTopCustomers); // get top customers

module.exports = router;
