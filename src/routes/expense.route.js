const express = require("express");
const router = express.Router();

const {
  createExpense,
  listExpenses,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController"); // import controller

const { authVerify } = require("../middlwares/authVerify"); // check authorization
const { businessChecker } = require("../middlwares/businessChecker"); // check for business account

router.post("/expense", authVerify, businessChecker, createExpense); // create expense
router.get("/expense/list", authVerify, businessChecker, listExpenses); // get expense list 
router.put("/update-expense/:id", authVerify, businessChecker, updateExpense); // update expense data
router.delete("/delete/:id", authVerify, businessChecker, deleteExpense); // delete expense data

module.exports = router;
