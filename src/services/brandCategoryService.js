const BrandModel = require("../models/brand.model"); // brand model
const CategoryModel = require("../models/category.model"); // category model

// =================== Brand Services ==============

//create Brand service
exports.createBrandservice = async (req, res) => {
  try {
    const { name } = req.body;
    const userID = req.headers.user_id;
    const businessID = req.headers.business_id;
    const existBrand = await BrandModel.find({
      userID: userID,
      businessID: businessID,
    });

    if (existBrand.name === name)
      return res.status(401).json({ message: "Brand Already exits, try new" });

    const brand = await BrandModel.create({
      userID: userID,
      businessID: businessID,
      name,
    });
    res.status(201).json({ message: "Brand Created", brand });
  } catch (err) {
    res.status(500).json({ message: "Brand create failed" });
  }
};

// get Brands service
exports.getBrandsservice = async (req, res) => {
  try {
    const brands = await BrandModel.find({
      userID: req.headers.user_id,
      businessID: req.headers.business_id,
    });
    res.status(200).json(brands);
  } catch (err) {
    res.status(500).json({ message: "Brand fetch failed" });
  }
};

//update Brand service
exports.updateBrandservice = async (req, res) => {
  try {
    const { name } = req.body;
    const updated = await BrandModel.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    res.status(200).json({ message: "Brand Name Updated", updated });
  } catch (err) {
    res.status(500).json({ message: "Brand update failed" });
  }
};

//delete Brand service
exports.deleteBrandservice = async (req, res) => {
  try {
    await BrandModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Brand deleted" });
  } catch (err) {
    res.status(500).json({ message: "Brand delete failed" });
  }
};

// ============= Category Services ===================

//create Category Service
exports.createCategoryService = async (req, res) => {
  try {
    const { name } = req.body;
    const userID = req.headers.user_id;
    const businessID = req.headers.business_id;
    const existCategory = await CategoryModel.find({
      userID: userID,
      businessID: businessID,
    });

    if (existCategory.name === name)
      return res
        .status(401)
        .json({ message: "Category Already exits, try new" });

    const category = await CategoryModel.create({
      userID: userID,
      businessID: businessID,
      name,
    });
    res.status(201).json({ message: "Category created", category });
  } catch (err) {
    res.status(500).json({ message: "Category create failed" });
  }
};

// get Categories Service
exports.getCategoriesService = async (req, res) => {
  try {
    const categories = await CategoryModel.find({
      userID: req.headers.user_id,
      businessID: req.headers.business_id,
    });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: "Category fetch failed" });
  }
};

// update Category Service
exports.updateCategoryService = async (req, res) => {
  try {
    const { name } = req.body;
    const updated = await CategoryModel.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    res.status(200).json({ message: "Category Name Updated", updated });
  } catch (err) {
    res.status(500).json({ message: "Category update failed" });
  }
};

// delete Category Service
exports.deleteCategoryService = async (req, res) => {
  try {
    await CategoryModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: "Category delete failed" });
  }
};
