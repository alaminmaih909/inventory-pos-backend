
const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const SaleModel = require("../models/sales.model");

//get Sales Report Service
exports.getSalesReportService = async(req,res) =>{
    try {
    const userID = req.headers.user_id;
    const businessID = req.headers.business_id;

    const { page = 1, limit = 10, invoiceNo, customerID, startDate, endDate } = req.query;

    const match = {
      userID,
      businessID,
    };

    if (invoiceNo) match.invoiceNo = { $regex: invoiceNo, $options: "i" };
    if (customerID) match.customerID = customerID;
    if (startDate && endDate) {
      match.saleDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const sales = await SaleModel.find(match)
      .populate("customerID", "customerName phone email")
      .sort({ saleDate: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await SaleModel.countDocuments(match);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: sales,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: "Server error", error: e.message });
  }
}

//generate Sales PDF Service
exports.generateSalesPDFService = async(req,res) =>{
   try {
    const userID = req.headers.user_id;
    const businessID = req.headers.business_id;

    const { startDate, endDate } = req.query;

    const match = {
      userID,
      businessID,
      saleDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };

    const sales = await SaleModel.find(match).populate("customerID");

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=sales-report.pdf");
    doc.pipe(res);

    doc.fontSize(16).text("Sales Report", { align: "center" });
    doc.moveDown();

    sales.forEach((sale, index) => {
      doc.fontSize(10).text(`${index + 1}. Invoice: ${sale.invoiceNo} | Customer: ${sale.customerID?.customerName}`);
      doc.text(`Total: ${sale.totalAmount} | Paid: ${sale.paidAmount} | Due: ${sale.dueAmount}`);
      doc.moveDown(0.5);
    });

    doc.end();
  } catch (e) {
    res.status(500).json({ success: false, message: "PDF creation failed", error: e.message });
  }
}


//generate Sales Excel Service
exports.generateSalesExcelService = async(req,res) =>{
      try {
    const userID = req.headers.user_id;
    const businessID = req.headers.business_id;

    const { startDate, endDate } = req.query;

    const match = {
      userID,
      businessID,
      saleDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };

    const sales = await SaleModel.find(match).populate("customerID", "customerName");

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sales Report");

    worksheet.columns = [
      { header: "Invoice No", key: "invoiceNo", width: 20 },
      { header: "Customer", key: "customer", width: 25 },
      { header: "Total Amount", key: "totalAmount", width: 15 },
      { header: "Paid", key: "paidAmount", width: 15 },
      { header: "Due", key: "dueAmount", width: 15 },
      { header: "Date", key: "saleDate", width: 20 },
    ];

    sales.forEach((sale) => {
      worksheet.addRow({
        invoiceNo: sale.invoiceNo,
        customer: sale.customerID?.customerName,
        totalAmount: sale.totalAmount,
        paidAmount: sale.paidAmount,
        dueAmount: sale.dueAmount,
        saleDate: sale.saleDate.toISOString().split("T")[0],
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=sales-report.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (e) {
    res.status(500).json({ success: false, message: "Excel export failed", error: e.message });
  }
}

