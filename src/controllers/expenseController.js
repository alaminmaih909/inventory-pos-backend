const {
  createExpenseService,
  listExpensesService,
  updateExpenseService,
  deleteExpenseService,
} = require("../services/expenseService"); // import service

// create expense controller
exports.createExpense = async (req, res) => {
  await createExpenseService(req, res);
};

// list Expenses
exports.listExpenses = async (req, res) => {
  await listExpensesService(req, res);
};

//update Expense
exports.updateExpense = async (req, res) => {
  await updateExpenseService(req, res);
};

// delete Expense
exports.deleteExpense = async (req, res) => {
  await deleteExpenseService(req, res);
};
