const {createSaleService,getSalesListService,updateDuePaymentService,returnSaleService} = require("../services/SalesService");

// create sale
exports.createSale = async ( req,res) => {
    await createSaleService(req,res);
}

// get sales list 
exports.getSalesList = async (req,res) =>{
    await getSalesListService(req,res);
}

//  upadate sales due data 
exports.updateDuePayment = async (req,res) =>{
    await updateDuePaymentService(req,res);
}

//  return sale
exports.returnSale = async (req,res) =>{
    await returnSaleService(req,res);
}