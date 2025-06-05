// brand
const {
  createBrandservice,
  getBrandsservice,
  updateBrandservice,
  deleteBrandservice,
} = require("../services/brandCategoryService");

// category
const {
  createCategoryService,
  getCategoriesService,
  updateCategoryService,
  deleteCategoryService,
} = require("../services/brandCategoryService");

// =================== Brand ===================

// create brand
exports.createBrand = async (req, res) => {
  await createBrandservice(req, res);
};

// get Brands
exports.getBrands = async (req, res) => {
  await getBrandsservice(req, res);
};

// create brand
exports.updateBrand = async (req, res) => {
  await updateBrandservice(req, res);
};

// create brand
exports.deleteBrand = async (req, res) => {
  await deleteBrandservice(req, res);
};

//=================== Category ===================

// create Category
exports.createCategory = async (req, res) => {
  await createCategoryService(req, res);
};

// get Categories
exports.getCategories = async (req, res) => {
  await getCategoriesService(req, res);
};

// update Category
exports.updateCategory = async (req, res) => {
  await updateCategoryService(req, res);
};

// delete Category
exports.deleteCategory = async (req, res) => {
  await deleteCategoryService(req, res);
};
