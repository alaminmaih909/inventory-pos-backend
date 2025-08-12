// routes/SalesRoute.js

const express = require("express");
const router = express.Router();

const { createSale } = require("../controllers/salesController"); // sales controller

// middleware
const { authVerify } = require("../middlwares/authVerify"); // Authentication check
const { businessChecker } = require("../middlwares/businessChecker"); // business check

router.post("/create", authVerify, businessChecker, createSale); // sales create
router.get("/sales-list", authVerify, businessChecker, getSalesList); // get sales list
router.patch("/sales-due/:id", authVerify, businessChecker, updateDuePayment); // upadate sales due data
router.patch("/sales-return/:id", authVerify, businessChecker, returnSale); // return sale

module.exports = router;
