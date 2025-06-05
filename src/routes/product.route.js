const express = require("express");

const router = express.Router();

const {
  createBrand,
  getBrands,
  updateBrand,
  deleteBrand,
} = require("../controllers/brandCategoryController"); // Brand

const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/brandCategoryController"); // Category

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getLowStockAlert,
} = require("../controllers/productController"); // product

const { authVerify } = require("../middlwares/authVerify");
const { businessChecker } = require("../middlwares/businessChecker");

//=================== brand ===================
router.post("/brand", authVerify, businessChecker, createBrand); // create Brand
router.get("/brand", authVerify, businessChecker, getBrands); //get Brands
router.put("/brand/:id", authVerify, updateBrand); //update Brand
router.delete("/brand/:id", authVerify, deleteBrand); //delete Brand

//=================== category ===================
router.post("/category", authVerify, businessChecker, createCategory); //create Category
router.get("/category", authVerify, businessChecker, getCategories); //get Categories
router.put("/category/:id", authVerify, updateCategory); // update Category
router.delete("/category/:id", authVerify, deleteCategory); // delete Category

// =================== Product Routes ===================
router.post("/product", authVerify, businessChecker, createProduct); // Create Product

/* /api/products?brand=Samsung&category=Monitor&productName=Ultra&productCode=SM123&page=1&limit=10  */
/* এখানে সব কিছুর মান optional — মানে যদি user শুধু Brand দেয়, তাহলেও call কাজ করবে। */
router.get("/products", authVerify, businessChecker, getAllProducts); // Get All Products

/* // aita baki ache test korer */
router.get("/product/:id", authVerify, businessChecker, getSingleProduct); // Get One Product by ID

router.put("/product/:id", authVerify, updateProduct); // Update Product
router.delete("/product/:id", authVerify, deleteProduct); // Delete Product

router.get("/product/lowstock", authVerify, businessChecker, getLowStockAlert); // low stock product alert;

module.exports = router;
