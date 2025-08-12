
// sales report services
const{getSalesReportService,generateSalesPDFService,generateSalesExcelService} = require("../services/reportServices");


/* ======= sales report controller ======== */

//
exports.getSalesReport = async(req,res) =>{
    await getSalesReportService   (req,res);
}

//
exports.generateSalesPDF = async(req,res) =>{
    await generateSalesPDFService(req,res);
}


//
exports.generateSalesExcel = async(req,res) =>{
    await generateSalesExcelService(req,res);
}