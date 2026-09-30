const express = require("express");
const router = express.Router();
const ParkingSession = require("../models/ParkingSession");
const Booking = require("../models/Booking");
const ParkingSlot = require("../models/ParkingSlot");

router.post("/start",async(req,res)=>{
    try{
        const {booking} = req.body;
        if(!booking){
            return res.status(400).json({
                message:"Booking ID is required"
            });
        }

        const existingBooking = await Booking.findOne({
            _id:booking,
            status:"confirmed"
        });
        if(!existingBooking){
            return res.status(404).json({
                message:"Confirmed booking not found"
            });
        }

        const slot = await ParkingSlot.findById(existingBooking.parkingSlot);
        if(!slot){
            return res.status(404).json({
                message:"Parking slot not found"
            });
        }

        if(slot.parkingType !== "public"){
            return res.status(404).json({
                message:"Parking session is only for public parking"
            });
        }

        const existingSession = await ParkingSession.findOne({
            booking:existingBooking._id,
            status:"active"
        });
        if(existingSession){
            return res.status(400).json({
                message:"Parking session already active"
            });
        }

        const session = await ParkingSession.create({
            booking:existingBooking._id,
            parkingSlot:existingBooking.parkingSlot,
            vehicleNumber:existingBooking.vehicleNumber,
            entryTime:new Date()
        });
        slot.status = "occupied";
        await slot.save();

        res.status(201).json({
            message:"Public parking session started",
            session
        });
    }catch(error){
        res.status(500).json({
            message:"Failed to start parking session",
            error:error.message
        });
    }
});

router.get("/active",async(req,res)=>{
    try{
        const session = await ParkingSession.findOne({
            status:"active"
        })
        .populate("booking")
        .populate("parkingSlot");

        if(!session){
            return res.status(404).json({
                message:"No active parking session"
            });
        }

        res.status(200).json({session});
    }catch(error){
        res.status(500).json({
            message:"Failed to fetch parking session",
            error:error.message
        });
    }
});

router.put("/:id/end",async(req,res)=>{
    try{
        const session = await ParkingSession.findOne({
            _id:req.params.id,
            status:"active"
        });
        if(!session){
            return res.status(404).json({
                message:"Active parking session not found"
            });
        }

        session.exitTime = new Date();
        session.status = "completed";

        await session.save();

        await Booking.findByIdAndUpdate(session.booking,{status:"completed"});

        await ParkingSlot.findByIdAndUpdate(session.parkingSlot,{status:"available"});
        
        res.status(200).json({
            message:"Public parking session completed",
            session
        });
    }catch(error){
        res.status(500).json({
            message:"Failed to end parking session",
            error:error.message
        })
    }
});


module.exports = router;