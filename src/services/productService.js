const ProductModel = require("../models/product.model.js");
const BrandModel = require("../models/brand.model");
const CategoryModel = require("../models/category.model");

// create product by user
exports.createProductService = async (req, res) => {
  try {
    const userID = req.headers.user_id;
    const businessID = req.headers.business_id;

    if (!userID && !businessID) {
      return res.status(401).json({ message: "UnAthorized" });
    }

    const {
      productName,
      productCode,
      unit,
      category,
      brand,
      purchasePrice,
      sellPrice,
      stock,
      alertQuantity,
      discountType,
      discountValue,
      warrantyType,
      warrantyDuration,
    } = req.body;

    const exitsBrand = await BrandModel.findOne({ name: req.body.brand });
    const exitsCategory = await CategoryModel.findOne({
      name: req.body.category,
    });

    if (!exitsBrand) {
      return res
        .status(404)
        .json({ message: "No Brand Found,Please Create One" });
    }

    if (!exitsCategory) {
      return res
        .status(404)
        .json({ message: "No Category Found,Please Create One" });
    }

    const product = await ProductModel.create({
      userID: userID,
      businessID: businessID,
      productName: productName,
      productCode: productCode,
      unit: unit,
      category: category,
      brand: brand,
      purchasePrice: Number(purchasePrice),
      sellPrice: Number(sellPrice),
      stock: Number(stock),
      alertQuantity: Number(alertQuantity),
      discountType: discountType,
      discountValue: Number(discountValue),
      warrantyType: warrantyType,
      warrantyDuration: Number(warrantyDuration),
    });
    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Product creation failed", error: err.message });
  }
};

// get All Products Service
/* exports.getAllProductsService = async (req, res) => {
  try {
    const userID = req.headers.user_id;
    const businessID = req.headers.business_id;
    const products = await ProductModel.find({ userID, businessID });

    if (!products) {
      return res
        .status(404)
        .json({ message: "Empty Product, add a new product" });
    }

    return res.status(200).json(products);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Fetching products failed", error: err.message });
  }
};
 */

// get all product with pagination
/* /api/products?brand=Samsung&category=Monitor&productName=Ultra&productCode=SM123&page=1&limit=10  */
/* এখানে সব কিছুর মান optional — মানে যদি user শুধু Brand দেয়, তাহলেও call কাজ করবে। */
exports.getAllProductsService = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const userID = req.headers.user_id;
    const businessID = req.headers.business_id;

    const filter = {};

    if (userID) filter.userID = userID;
    if (businessID) filter.businessID = businessID;

    // 🔍 Search by name/category/brand/code
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      filter.$or = [
        { productName: searchRegex },
        { category: searchRegex },
        { brand: searchRegex },
        { productCode: searchRegex },
      ];
    }

    const products = await ProductModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ProductModel.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      products,
    });
  } catch (err) {
    res.status(500).json({ message: "Fetch failed", error: err.message });
  }
};

// ✅ Get Single Product
exports.getSingleProduct = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed", error: err.message });
  }
};

// get Single Product Service
exports.getSingleProductService = async (req, res) => {
  try {
    const businessID = req.headers.business_id;
    const productID = req.params.id;
    const product = await ProductModel.findOne({ businessID, productID });
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch product", error: err.message });
  }
};

// update Product Service
exports.updateProductService = async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

//delete Product Service
exports.deleteProductService = async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

// get Low Stock Alert Service
exports.getLowStockAlertService = async (req, res) => {
  try {
    const userID = req.headers.user_id; // middleware
    const businessID = req.headers.business_id;

    const products = await ProductModel.find({
      userID,
      businessID,
      $expr: { $lt: ["$stock", "$alertQuantity"] },
    });

    res.status(200).json({
      status: "success",
      data: products,
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: "Server Error" });
  }
};
