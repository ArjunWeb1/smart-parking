const express = require("express");
const router = express.Router();
const Bill = require("../models/Bill");
const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const ParkingSession = require("../models/ParkingSession");

router.post("/create",async(req,res)=>{
    try{
        const {paymentId} = req.body;
        if(!paymentId){
            return res.status(400).json({
                message:"Payment ID is required"
            });
        }

        const payment = await Payment.findById(paymentId);
        if(!payment){
            return res.status(404).json({
                message:"Payment not found"
            });
        }
        if(payment.paymentStatus !== "paid"){
            return res.status(400).json({
                message:"Payment must be completed before generating bill"
            });
        }

        const existingBill = await Bill.findOne({
            payment:payment._id
        });
        if(existingBill){
            return res.status(200).json({
                message:"Bill already exits"
            });
        }

        const booking = await Booking.findById(payment.booking);
        if(!booking){
            return res.status(404).json({
                message:"Booking not found"
            });
        }
    
        const session = await ParkingSession.findOne({
            booking:booking._id,
            status:"completed"
        });
        if(!session){
            return res.status(404).json({
                message:"Completed parking session not found"
            });
        }

        const billNumber = "BILL-" + Date.now();
        const durationMinutes = Math.ceil(session.exitTime - session.entryTime)/ (1000 * 60);

        const bill = await Bill.create({
            billNumber:billNumber,
            booking:booking._id,
            payment:payment._id,
            vehicleNumber:booking.vehicleNumber,
            vehicleType:booking.vehicleType,
            parkingSlot:booking.parkingSlot,
            entryTime:session.entryTime,
            exitTime:session.exitTime,
            durationMinutes:durationMinutes,
            amount:payment.amount,
            paymentMethod:payment.paymentMethod,
            paymentStatus :"paid"
        });

        res.status(201).json({
            message:"Bill generated successfully",
            bill
        });
    }catch(error){
        connsole.error("Bill Error:",error);
        res.status(500).json({
            message:"Failed to generate bill",
            error:error.message
        });
    }
});

module.exports = router;