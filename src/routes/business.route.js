const express = require("express");
const router = express.Router();
const {
  createBusiness,
  getAllBusiness,
  getBusiness,
  updateBusiness,
  deleteBusinessReq,
  deleteBusiness,
} = require("../controllers/businessController");
const {authVerify} = require("../middlwares/authVerify");

router.post("/business", authVerify, createBusiness); // create a new business;
router.get("/business", authVerify, getAllBusiness); // get all business list
router.get("/business/:id", authVerify, getBusiness); // get a single bsuiness

router.put("/business/:id", authVerify, updateBusiness); // update business data;
router.get("/business/delete-request/:id",authVerify,deleteBusinessReq); // request for delete bsuiness
router.delete("/business/:id", deleteBusiness); // confirm delete business

module.exports = router;
