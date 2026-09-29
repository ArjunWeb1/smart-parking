const express = require("express");
const router = express.Router();
const waitingQueue = require("../models/WaitingQueue");
const Vehicle = require("../models/Vehicle");
const protect = require("../middleware/authMiddleware");
const WaitingQueue = require("../models/WaitingQueue");
const { stat } = require("fs");

router.post("/",protect,async(req,res)=>{
    try{
        if(req.user.role !== "public"){
            return res.status(403).json({
                message:"Waiting queue is only available for public parking"
            });
        }
        const {vehicle} = req.body;
        if(!vehicle){
            return res.status(400).json({
                message:"Vehcile is required"
            });
        }

        const userVehicle = await Vehicle.findOne({
            _id:vehicle,
            owner:req.user.id
        });
        if(!userVehicle){
            return res.status(403).json({
                message:"Vehicle does not belong to this user"
            });
        }

        const existingEntry = await WaitingQueue.findOne({
            user:req.user.id,
            status:"waiting"
        });
        if(existingEntry){
            return res.status(409).json({
                message:"YOua re already in the waiting queue"
            });
        }

        const lastEntry = await WaitingQueue.findOne({
            status:"waiting"
        }).sort({position:-1});
        const position = lastEntry ? lastEntry.position +1:1;

        const queueEntry = await WaitingQueue.create({
            user:req.user.id,
            vehicle,
            vehicleType:userVehicle.vehicleType,
            position
        });

        res.status(201).json({
            message:"Added to waiting queue successfully",
            queueEntry
        });
    }catch(error){
        return res.status(500).json({
            message:"Falied to join waiting queue",
            error:error.message
        });
    }
})

router.get("/",protect,async(req,res)=>{
    try{
        const queueEntries = await WaitingQueue.find({
            user:req.user.id
        })
        .populate("vehicle");

        res.status(200).json({
            count:queueEntries.length,
            queueEntries
        });
    }catch(error){
        return res.status(500).json({
            message:"Failed tp fetch waiting queue",
            error:error.message
        });
    }
});

router.delete("/:id",protect,async(req,res)=>{
    try{
        const queueEntry = await WaitingQueue.findById(req.params.id);
        if(!queueEntry){
            return res.status(404).json({
                message:"Queue entry not found"
            });
        }

        if(queueEntry.user.toString() !== req.user.id){
            return res.status(403).json({
                message:"You cannot remove this queue entry"
            });
        }
        
        if(queueEntry.status !== "waiting"){
            return res.status(400).json({
                message:"Queue entry is not active"
            });
        }

        queueEntry.status = "cancelled";
        await queueEntry.save();

        res.status(200).json({
            message:"Removed from waiting queue successfully",
            queueEntry
        });
    }catch(error){
        return res.status(500).json({
            message:"Failed to leave waiting queue",
            error:error.message
        });
    }
});

module.exports = router;