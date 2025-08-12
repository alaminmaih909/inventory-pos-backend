const ExpenseModel = require("../models/expense.model");

// create Expense Service
exports.createExpenseService = async (req, res) => {
  try {
    const userID = req.headers.user_id;
    const businessID = req.headers.business_id;
    const { expenseType, amount, note } = req.body;

    const expense = await ExpenseModel.create({
      userID,
      businessID,
      expenseType,
      amount,
      note,
    });

    return res.status(201).json({ message: "Expense Created", expense });
  } catch (err) {
    console.error("expense create error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

//list Expenses Service
exports.listExpensesService = async (req, res) => {
  try {
    const userID = req.headers.user_id;
    const businessID = req.headers.business_id;

    const { page = 1, limit = 10, search = "" } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = {
      userID,
      businessID,
      expenseType: { $regex: search, $options: "i" },
    };

    const expenses = await ExpenseModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ExpenseModel.countDocuments(query);
    return res.status(200).json({ data: { total, expenses } });
  } catch (err) {
    console.error("expense list error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

//update Expense Service
exports.updateExpenseService = async (req, res) => {
  try {
    const userID = req.headers.user_id;
    const businessID = req.headers.business_id;
    const { id } = req.params;
    const { expenseType, amount, note } = req.body;

    const updatedExpense = await ExpenseModel.updateOne(
      { _id: id, userID, businessID },
      { expenseType, amount, note }
    );
    return res.status(200).json({ message: "Expense updated", updatedExpense });
  } catch (err) {
    console.error("expense update error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

//delete Expense Service
exports.deleteExpenseService = async (req, res) => {
  try {
    const userID = req.headers.user_id;
    const businessID = req.headers.business_id;
    const { id } = req.params;

    const deleted = await ExpenseModel.deleteOne({
      _id: id,
      userID,
      businessID,
    });

    return res.status(200).json({ message: "Expense deleted" });
  } catch (err) {
    console.error("expense delete error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};
