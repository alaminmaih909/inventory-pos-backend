const SalesModel = require("../models/sales.model");
const ProductModel = require("../models/product.model");

// create sale service
exports.createSaleService = async (req, res) => {
  try {
    const userID = req.headers.user_id;
    const businessID = req.headers.business_id;

    const {
      customerID,
      products,
      totalAmount,
      paidAmount,
      paymentMethod,
      note,
    } = req.body;

    // simple auto invoice
    const randomNumber = Math.floor(1000 + Math.random() * 900000); // 6 digit
    const invoiceNo = `INV-C-${randomNumber}}`;

    // calculate due
    const dueAmount = totalAmount - paidAmount;

    // sale entry
    const sale = await SalesModel.create({
      userID,
      businessID,
      customerID,
      invoiceNo,
      products,
      totalAmount,
      paidAmount,
      dueAmount,
      paymentMethod,
      note,
    });

    // stock decrement for each product
    for (const item of products) {
      await ProductModel.findByIdAndUpdate(
        item.productID,
        {
          $inc: { stock: -item.quantity },
        },
        { new: true }
      );

      // যদি warranty serial no থাকে, তাহলে সেইগুলো remove করতে হবে
      if (item.warrantySerialNo && item.warrantySerialNo.length > 0) {
        await ProductModel.findByIdAndUpdate(item.productID, {
          $pull: { warrantySerialNo: { $in: item.warrantySerialNo } },
        });
      }
    }

    return res.status(201).json({
      status: "success",
      message: "Sale Created Successfully",
      data: sale,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Sale creation failed",
      error: error.message,
    });
  }
};

// get sales list service
exports.getSalesListService = async (req, res) => {
  try {
    const userID = req.headers.user_id;
    const businessID = req.headers.business_id;

    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    const searchQuery = {
      userID,
      businessID,
      $or: [
        { invoiceNo: { $regex: search, $options: "i" } },
        { note: { $regex: search, $options: "i" } },
        // Customer populated হলে নাম দিয়ে ও খুঁজতে পারো
      ],
    };

    const data = await SalesModel.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("customerID");

    const total = await SalesModel.countDocuments(searchQuery);

    return res.status(200).json({
      status: "success",
      total,
      page,
      limit,
      data,
    });
  } catch (error) {
    return res.status(500).json({ status: "fail", message: error.message });
  }
};

//  upadate sales due data service
exports.updateDuePaymentService = async (req, res) => {
  try {
    const saleID = req.params.id;
    const { paidAmount } = req.body;

    const sale = await SalesModel.findById(saleID);

    if (!sale) {
      return res
        .status(404)
        .json({ status: "fail", message: "Sale not found" });
    }

    sale.paidAmount += paidAmount;
    sale.dueAmount -= paidAmount;

    await sale.save();

    return res.status(200).json({
      status: "success",
      message: "Due Payment Updated",
      data: sale,
    });
  } catch (error) {
    return res.status(500).json({ status: "fail", message: error.message });
  }
};

//  return sale service
exports.returnSaleService = async (req, res) => {
  try {
    const saleID = req.params.id;
    const { products, note } = req.body;

    const sale = await SalesModel.findById(saleID);

    if (!sale) {
      return res
        .status(404)
        .json({ status: "fail", message: "Sale not found" });
    }

    // 👉 Loop করে stock কমাও
    for (const item of products) {
      await ProductModel.findByIdAndUpdate(
        item.productID,
        { $inc: { stock: item.quantity } },
        { new: true }
      );
    }

    sale.returned = true;
    sale.returnNote = note;

    await sale.save();

    return res.status(200).json({
      status: "success",
      message: "Sale Returned Successfully",
      data: sale,
    });
  } catch (error) {
    return res.status(500).json({ status: "fail", message: error.message });
  }
};
