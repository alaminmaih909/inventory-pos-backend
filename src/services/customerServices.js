const CustomerModel = require("../models/category.model");

// create Customer Service
exports.createCustomerService = async (req, res) => {
  try {
    const userID = req.headers.user_id;
    const businessID = req.headers.business_id;
    const { name, phone, address } = req.body;

    if (!name || !phone || address) {
      return res.json({ message: "Need customer data" });
    }

    const customer = new CustomerModel({
      userID: userID,
      businessID: businessID,
      name: name,
      phone: phone,
      address: address,
    });
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ message: "Customer create failed", error: err });
  }
};

// get Customers Service (All customer)
exports.getCustomersService = async (req, res) => {
  try {
    const { search = "", page = 1, limit } = req.query;

    const userID = req.headers.user_id;
    const businessID = req.headers.business_id;

    const query = {
      userID,
      businessID,
      $or: [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    const skip = (page - 1) * limit;
    const customers = await CustomerModel.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await CustomerModel.countDocuments(query);

    res.status(200).json({
      total,
      page: Number(page),
      limit: Number(limit),
      customers,
    });
  } catch (err) {
    res.status(500).json({ message: "Customer fetch failed", error: err });
  }
};

// get a single Customers Service
exports.getCustomerService = async (req, res) => {
  try {
    const customer = await CustomerModel.findOne(req.params.phone);
    res.status(200).json(customer);
  } catch (err) {
    res.status(500).json({ message: "Customer fetch failed", error: err });
  }
};

//  Customer update Service
exports.updateCustomerService = async (req, res) => {
  try {
    const customer = await CustomerModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ message: " Update successfully", customer });
  } catch (err) {
    res.status(500).json({ message: "Customer update failed", error: err });
  }
};

// customer delete service
exports.deleteCustomerService = async (req, res) => {
  try {
    await CustomerModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Customer deleted" });
  } catch (err) {
    res.status(500).json({ message: "Customer delete failed", error: err });
  }
};

// Get due customers
exports.getDueCustomersService = async (req, res) => {
  try {
    const userID = req.headers.user_id;
    const businessID = req.headers.business_id;

    const dueCustomers = await CustomerModel.find({
      userID,
      businessID,
      totalDue: { $gt: 0 },
    }).sort({ totalDue: -1 });

    res.status(200).json(dueCustomers);
  } catch (err) {
    res.status(500).json({ message: "Due customers fetch failed", error: err });
  }
};

// Get top customers by purchase
exports.getTopCustomersService = async (req, res) => {
  try {
    const { limit } = req.query; // limit as a number

    const userID = req.headers.user_id;
    const businessID = req.headers.business_id;

    const topCustomers = await CustomerModel.find({ userID, businessID })
      .sort({ totalPurchase: -1 })
      .limit(Number(limit));

    res.status(200).json(topCustomers);
  } catch (err) {
    res.status(500).json({ message: "Top customers fetch failed", error: err });
  }
};
