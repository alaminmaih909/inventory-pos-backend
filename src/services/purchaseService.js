const ProductModel = require("../models/product.model"); // product model
const PurchaseModel = require("../models/purchase.model"); // purchase model

const { generateInvoiceNoPurchase } = require("../utils/invoiceGenerator");
/* // create Purchase Service
exports.createPurchaseService = async(req,res) => {
    try {

        // from header
        const userID = req.headers.user_id;
        const businessID = req.headers.business_id;

        // from query
        const supplierID = req.query.supplier_id; 
        
        // from body
        const {} = req.body;

        // const invoiceNo = 
        const products =  ;
    const purchase = new PurchaseModel({
            userID,businessID,supplierID,
    });
    await purchase.save();

    // Stock Update
    for (const item of purchase.products) {
      await ProductModel.findByIdAndUpdate(
        item.productID,
        { $inc: { stock: item.quantity } },
        { new: true }
      );
    }

    res.status(201).json({ status: "success", data: purchase });
  } catch (error) {
    res.status(500).json({ status: "fail", error: error.message });
  }
} */

// create Purchase Service
exports.createPurchaseService = async (req, res) => {
  try {
    const userID = req.headers.user_id;
    const businessID = req.headers.business_id;
    const supplierID = req.query.supplier_id;

    // products ta frontend theke array object kore dibo

    const { products, discount, paidAmount, dueAmount, note } = req.body;

    // 🧾 Invoice Number
    const invoiceNo = await generateInvoiceNoPurchase(businessID);

    // Stock update & warranty serial  validation and update
    for (const item of products) {
      await ProductModel.findByIdAndUpdate(
        item.productID,
        { $inc: { stock: item.quantity } },
        { new: true }
      );

      /* // ওয়ারেন্টি সিরিয়াল এর সংখ্যা যেন কোয়ান্টিটির চেয়ে বেশি না হয়

      if (item.warrantySerialNo.length > item.quantity) {
        return res.status(400).json({
          status: "fail",
          message: "ওয়ারেন্টি সিরিয়াল নম্বর কোয়ান্টিটির চেয়ে বেশি দেওয়া হয়েছে।",
        });
      }

      // যদি ওয়ারেন্টি সিরিয়াল থাকে তাহলে চেক করো
      if (item.warrantySerialNo && item.warrantySerialNo.length > 0) {
        await ProductModel.findByIdAndUpdate(
          item.productID,
          { $push: { warrantySerialNo: { $each: item.warrantySerialNo } } },
          { new: true }
        );
      } */
    }

    let totalAmount = 0; // total product price

    // total product price calculation
    for (const item of products) {
      totalAmount += item.purchasePrice * item.quantity;
    }

    if (discount) {
      totalAmount = totalAmount - discount;
    }

    const newPurchase = new PurchaseModel({
      userID,
      businessID,
      supplierID,
      invoiceNo,
      products,
      totalAmount,
      discount,
      paidAmount,
      dueAmount,
      note,
    });

    await newPurchase.save();

    return res
      .status(201)
      .json({ message: "Purchase Created Successfully", newPurchase });
  } catch (error) {
    return res.status(500).json({
      message: "Problem in creating purchase ",
      error: error.message,
    });
  }
};

// get All Purchases Service
exports.getAllPurchasesService = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (page - 1) * limit;

    const searchQuery = {
      $or: [
        { invoiceNo: { $regex: search, $options: "i" } },
        { note: { $regex: search, $options: "i" } },
      ],
    };

    const data = await PurchaseModel.find(searchQuery)
      .populate("supplierID", "supplierName")
      .populate("products.productID", "productName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await PurchaseModel.countDocuments(searchQuery);

    res.status(200).json({
      status: "success",
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      data,
    });
  } catch (error) {
    res.status(500).json({ status: "fail", error: error.message });
  }
};

// get Purchase Service
exports.getPurchaseService = async (req, res) => {
  try {
    const data = await PurchaseModel.findById(req.params.id)
      .populate("supplierID", "supplierName")
      .populate("products.productID", "productName");

    if (!data)
      return res.status(404).json({ status: "fail", message: "Not found" });

    res.status(200).json({ status: "success", data });
  } catch (error) {
    res.status(500).json({ status: "fail", error: error.message });
  }
};

// update Purchase Service
exports.updatePurchaseService = async (req, res) => {
  try {
    const data = await PurchaseModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json({ status: "success", data });
  } catch (error) {
    res.status(500).json({ status: "fail", error: error.message });
  }
};

// delete Purchase Service
exports.deletePurchaseService = async (req, res) => {
  try {
    const purchase = await PurchaseModel.findByIdAndDelete(req.params.id);

    if (!purchase)
      return res.status(404).json({ status: "fail", message: "Not found" });

    // Stock rollback (optional)
    for (const item of purchase.products) {
      await ProductModel.findByIdAndUpdate(
        item.productID,
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
    }

    res.status(200).json({ status: "success", message: "Deleted" });
  } catch (error) {
    res.status(500).json({ status: "fail", error: error.message });
  }
};
