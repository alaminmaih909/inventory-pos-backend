const PurchaseModel = require("../models/purchase.model");

// new Invoice No generator for purchase
 exports.generateInvoiceNoPurchase = async (businessID) => {
  // search last invoiceNo
  const lastPurchase = await PurchaseModel.findOne({ businessID })
    .sort({ createdAt: -1 })
    .limit(1);

  let newInvoiceNumber = 1;

  if (lastPurchase && lastPurchase.invoiceNo) {
    const lastInvoice = lastPurchase.invoiceNo;
    const lastNumber = parseInt(lastInvoice.split("-")[1]);
    if (!isNaN(lastNumber)) {
      newInvoiceNumber = lastNumber + 1;
    }
  }

  // Format return (9 digit padded number)
  return `INV-P-${String(newInvoiceNumber).padStart(9, "0")}`;
};
