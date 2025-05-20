const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

// const mongoSanitize = require("express-mongo-sanitize");
const connectDB = require("./config/db");

// routes
const userRoute = require("./routes/user.route"); // user routes
const businessRoute = require("./routes/business.route"); // business route
// const productRoute = require("./routes/productRoute"); // product route


dotenv.config();

const app = express();

// Connect DB
connectDB();

// Middlewares
app.use(helmet());
app.use(cors({
  origin: "http://localhost:5000", 
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(rateLimit({ windowMs: 10 * 60 * 1000, max: 100 }));

// Routes
app.use("/api/v1", userRoute); // user related routes
app.use("/api/v1",businessRoute); // bsuiness route
// app.use("/api/v1", productRoute)  // product related routes


module.exports = app;
