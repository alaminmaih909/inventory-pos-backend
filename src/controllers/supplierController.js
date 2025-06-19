const {
  createSupplierService,
  getSuppliersService,
  getSupplierService,
  updateSupplierService,
  deleteSupplierService,
} = require("../services/supplierService");

// create a supplier
exports.createSupplier = async (req, res) => {
  await createSupplierService(req, res);
};

// get all supplier
exports.getSuppliers = async (req, res) => {
  await getSuppliersService(req, res);
};

// get a single supplier
exports.getSupplier = async (req, res) => {
  await getSupplierService(req, res);
};

// update supplier
exports.updateSupplier = async (req, res) => {
  await updateSupplierService(req, res);
};

// delete supplier
exports.deleteSupplier = async (req, res) => {
  await deleteSupplierService(req, res);
};
