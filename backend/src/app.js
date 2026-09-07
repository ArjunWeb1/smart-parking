const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth",authRoutes);

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "AI Smart Parking System Backend is running"
    });
});

module.exports = app;