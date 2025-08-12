const express = require("express");
const router = express.Router();

//middleware 
const {authVerify} = require("../middlwares/authVerify");
const{businessChecker} = require("../middlwares/businessChecker");


//sales report controller
const {getSalesReport,generateSalesPDF,generateSalesExcel} = require("../controllers/reportController");
/* ====== sales report====== */
router.get("/report-sales",authVerify,businessChecker, getSalesReport);
router.get("/report-sales/export-pdf",authVerify,businessChecker, generateSalesPDF);
router.get("/report-sales/export-excel",authVerify,businessChecker, generateSalesExcel);