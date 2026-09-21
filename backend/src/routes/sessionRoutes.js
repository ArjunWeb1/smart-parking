const express = require("express");
const router = express.Router();

const ParkingSession = require("../models/ParkingSession");
const Booking = require("../models/Booking");
const ParkingSlot = require("../models/ParkingSlot");
const protect = require("../middleware/authMiddleware");


//start parkig sesssion
router.post("/start",protect,async(req,res)=>{
    try{
        const {booking} = req.body;

        if(!booking){
            return res.status(400).json({
                message:"Booking ID is required"
            });
        }

        const existingBooking = await Booking.findOne({
            _id:booking,
            user:req.user.id,
            status:"confirmed"
        });
        if(!existingBooking){
            return res.status(404).json({
                message:"Confirmed booking not found"
            });
        }

        const existingSession = await ParkingSession.findOne({
            booking,
            status:"active"
        });
        if(existingSession){
            return res.status(400).json({
                message:"Parking session alredy active"
            });
        }

        const session = await ParkingSession.create({
            user:req.user.id,
            vehicle:existingBooking.vehicle,
            parkingSlot:existingBooking.parkingSlot,
            booking:existingBooking._id
        });
        await ParkingSlot.findByIdAndUpdate(
            existingBooking.parkingSlot,
            {
                status:"occupied"
            }
        );

        res.status(201).json({
            message:"Parking session started",
            session
        })
    }catch(error){
        res.status(500).json({
            messaage:"Failed to start parking session",
            error:error.message
        });
    }
});

//Get active session
router.get("/active",protect,async(req,res)=>{
    try{
        const session = await ParkingSession.findOne({
            user:req.user.id,
            status:"active"
        })
            .populate("vehicle")
            .populate("parkingSlot")
            .populate("booking");
        
        if(!session){
            return res.status(404).json({
                message:"No active parking session"
            });
        }
        
        return res.status(200).json({
            session
        });
    }catch(error){
        res.status(500).json({
            message:"Failed to fetch parking session",
            error:error.message
        });
    }
});

//ENd parkgin session
router.put("/:id/end",protect,async(req,res)=>{
    try{
        const session = await ParkingSession.findOne({
            _id:req.params.id,
            user:req.user.id,
            status:"active"
        });;

        if(!session){
            return res.status(404).json({
                message:"Active parking session not found"
            });
        }

        session.exitTime = new Date();
        session.status = "completed";
        await session.save();

        await Booking.findByIdAndUpdate(
            session.booking,
            {
                status:"completed"
            }
        )

        await ParkingSlot.findByIdAndUpdate(
            session.parkingSlot,
            {
                status:"available"
            }
        );

        res.status(200).json({
            message:"Parking session completed",
            session
        });
    }catch(error){
        res.status(500).json({
            message:"Failed to end parking session",
            error:error.message
        });
    }
});

module.exports = router;