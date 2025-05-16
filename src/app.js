const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Connect DB
connectDB();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(mongoSanitize());
app.use(xss());
app.use(rateLimit({ windowMs: 10 * 60 * 1000, max: 100 }));

// Routes
app.use("/api/v1.1/", require("./routes/route"));

module.exports = app;
