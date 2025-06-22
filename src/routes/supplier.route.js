const express = require("express");
const router = express.Router();

const {
  createSupplier,
  getSuppliers,
  getSupplier,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/supplierController");

const { authVerify } = require("../middlwares/authVerify"); // authentication verification
const { businessChecker } = require("../middlwares/businessChecker"); // business verification

router.post("/supplier", authVerify, businessChecker, createSupplier); // create a supplier
router.get("/suppliers", authVerify, businessChecker, getSuppliers); // get all supplier
router.get("/supplier/:id", authVerify, businessChecker, getSupplier); // get a single aupplier
router.put("/supplier/:id", authVerify, businessChecker, updateSupplier); // update supplier
router.delete("/supplier/:id", authVerify, businessChecker, deleteSupplier); // delete supplier

module.exports = router;
