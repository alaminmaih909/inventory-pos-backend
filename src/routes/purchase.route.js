const express = require("express");
const router = express.Router();

const {
  createPurchase,
  getAllPurchases,
  getPurchase,
  updatePurchase,
  deletePurchase,
} = require("../controllers/purchaseController");

const { authVerify } = require("../middlwares/authVerify");
const { businessChecker } = require("../middlwares/businessChecker");

// Purchase management by user
router.post("/purchase", authVerify, businessChecker, createPurchase); // create purchase by user
router.get("/all-purchase", authVerify, businessChecker, getAllPurchases); // get all purchase
router.get("/purchase/:id", authVerify, businessChecker, getPurchase); // get single purchase
router.put("/purchase/:id", authVerify, businessChecker, updatePurchase); // update purchase data
router.delete("/purchase/:id", authVerify, businessChecker, deletePurchase); // delete purchase data

module.exports = router;
