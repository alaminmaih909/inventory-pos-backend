const {
  createProductService,
  getAllProductsService,
  getSingleProductService,
  updateProductService,
  deleteProductService,
  getLowStockAlertService,
} = require("../services/productService");

// create product by User
exports.createProduct = async (req, res) => {
  await createProductService(req, res);
};

// get All Products;
exports.getAllProducts = async (req, res) => {
  await getAllProductsService(req, res);
};

// get a single product
exports.getSingleProduct = async (req, res) => {
  await getSingleProductService(req, res);
};

//update Product by user
exports.updateProduct = async (req, res) => {
  await updateProductService(req, res);
};

// delete Product by user
exports.deleteProduct = async (req, res) => {
  await deleteProductService(req, res);
};

// get Low Stock Alert
exports.getLowStockAlert = async (req, res) => {
  await getLowStockAlertService(req, res);
};
