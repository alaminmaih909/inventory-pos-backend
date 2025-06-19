const SupplierModel = require("../models/supplier.model");

// create supplier service
exports.createSupplierService = async (req, res) => {
  try {
    const userID = req.headers.user_id; // from middleware
    const businessID = req.headers.business_id; // from middleware

    const { name, phone, address } = req.body; // from body

    const supplier = await SupplierModel.create({
      userID,
      businessID,
      name,
      phone,
      address,
    });
    return res.status(201).json({ message: "New Supplier created", supplier });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Supplier create failed", error: err });
  }
};

//get Suppliers Service
exports.getSuppliersService = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 20 } = req.query;

    const userID = req.headers.user_id; // from middleware
    const businessID = req.headers.business_id; // from middleware

    const noSupplierFound = await SupplierModel.find({ userID, businessID });

    // No supplier found check
    if (noSupplierFound.length === "") {
      return res.status(400).json({ message: "No Supplier here" });
    }

    const query = {
      userID,
      businessID,
      $or: [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
      ],
    };

    const skip = (page - 1) * limit;
    const suppliers = await SupplierModel.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await SupplierModel.countDocuments(query);

    return res.status(200).json({
      total,
      page: Number(page),
      limit: Number(limit),
      suppliers,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Suppliers fetch failed", error: err });
  }
};

//get a Supplier Service
exports.getSupplierService = async (req, res) => {
  try {
    const supplier = await SupplierModel.findById(req.params.id);
    return res.status(200).json(supplier);
  } catch (err) {
    return res.status(404).json({ message: "Supplier not found", error: err });
  }
};

//update Supplier Service
exports.updateSupplierService = async (req, res) => {
  try {
    const supplier = await SupplierModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.status(200).json({ message: "Supplier data updated", supplier });
  } catch (err) {
    return res.status(500).json({ message: "Update failed", error: err });
  }
};

//delete Supplier Service
exports.deleteSupplierService = async (req, res) => {
  try {
    await SupplierModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Delete failed", error: err });
  }
};
