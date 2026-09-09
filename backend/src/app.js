const express = require("express");
const cors = require("cors");
const protect = require("./middleware/authMiddleware");
const authRoutes = require("./routes/authRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const adminMiddleware = require("./middleware/adminMiddleware");
const app = express();
require("dotenv").config();


// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/vehicles",vehicleRoutes);

// Test route
app.get("/api/protected",protect, (req, res) => {
    res.json({
        message: "You have accessed to the protected route",
        user:req.user
    });
});

app.get("/api/admin/test",protect,adminMiddleware,(req,res)=>{
    res.status(200).json({
        message:"Admin access successfully",
        user:req.user
    });  
});
//Home
app.get("/",(req,res)=>{
    res.json({
        message:"AI Smart Parking System Backend is running"
    })
})

module.exports = app;