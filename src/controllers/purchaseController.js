const {
  createPurchaseService,
  getAllPurchasesService,
  getPurchaseService,
  updatePurchaseService,
  deletePurchaseService,
} = require("../services/purchaseService");

// create Purchase
exports.createPurchase = async (req, res) => {
  await createPurchaseService(req, res);
};

// getAllPurchases
exports.getAllPurchases = async (req, res) => {
  await getAllPurchasesService(req, res);
};

// get a Purchase data
exports.getPurchase = async (req, res) => {
  await getPurchaseService(req, res);
};

// update a Purchase data
exports.updatePurchase = async (req, res) => {
  await updatePurchaseService(req, res);
};

// delete a Purchase data
exports.deletePurchase = async (req, res) => {
  await deletePurchaseService(req, res);
};
