const express = require("express");
const cors = require("cors");
const protect = require("./middleware/authMiddleware");
const authRoutes = require("./routes/authRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const parkingRoutes = require("./routes/parkingRoutes");
const adminMiddleware = require("./middleware/adminMiddleware");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/vehicles",vehicleRoutes);
app.use("/api/parking",parkingRoutes);
app.use("/api/bookings",bookingRoutes);

app.get("/api/protected",protect,(req,res)=>{
    res.json({
        message:"You have accessed the protected route",
        user:req.user
    });
});

app.get("/api/admin/test",protect,adminMiddleware,(req,res)=>{
    res.status(200).json({
        message:"Admin access successfully",
        user:req.user
    });
});

app.get("/",(req,res)=>{
    res.status({
        message:"AI Smart Parking System Backend is running"
    });
});
module.exports = app;