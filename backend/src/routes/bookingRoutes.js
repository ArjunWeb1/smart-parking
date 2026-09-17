const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const ParkingSlot = require("../models/ParkingSlot");
const protect = require("../middleware/authMiddleware");

//Create Booking
router.post("/",protect,async(req,res)=>{
    try{
        const {vehicle,parkingSlot,bookingDate} = req.body;
        if(!vehicle || !parkingSlot || !bookingDate){
            return res.status(400).json({
                message:"Vehicle, parking slot, and booking date are required"
            });
        }

        const slot = await ParkingSlot.findById(parkingSlot);

        if(!slot){
            return res.status(404).json({
                message:"Parking slot not found"
            });
        }
        if(slot.status !== "available"){
            return res.status(400).json({
                message:"Parking slot is not available"
            });
        }

        const existingBooking = await Booking.findOne({
            parkingSlot,bookingDate,status:"confirmed"
        });
        if(existingBooking){
            return res.status(409).json({
                message:"This parking slot is already booked"
            });
        }

        const booking = await Booking.create({
            user: req.user.id,
            vehicle,
            parkingSlot,
            bookingDate
        });
        res.status(201).json({
            message:"Booking created successfully"
        });
    }catch(error){
        res.status(500).json({
            message:"Failed to create booking",
            error:error.message
        });
    }
});

//Get my bookingd
router.get("/",protect,async(req,res)=>{
    try{
        const bookings = await Booking.find({
            user:req.user.id
        })
            .populate("vehicle")
            .populate("parkingSlot");
        res.status(200).json({
            count:bookings.length,
            bookings
        });
    }catch(error){
        res.status(500).json({
            message:"Failed to fetch bookings",
            error:error.message
        });
    }
});

// Cancel Booking
router.put("/:id/cancel", protect, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                message: "Booking does not exist"
            });
        }

        if (booking.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You cannot cancel this booking"
            });
        }

        if (booking.status === "cancelled") {
            return res.status(400).json({
                message: "Booking is already cancelled"
            });
        }

        booking.status = "cancelled";
        await booking.save();

        res.status(200).json({
            message: "Booking cancelled successfully",
            booking
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to cancel booking",
            error: error.message
        });
    }
});

module.exports = router;