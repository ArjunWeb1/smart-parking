const mongoose = require("mongoose");
const ParkingSlot = require("./ParkingSlot");
const billSchema = new mongoose.Schema(
    {
        billNumber:{
            type:String,
            required:true,
            unique:true
        },

        booking:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Booking",
            required:true
        },

        payment:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Payment",
            required:true
        },

        vehicleNumber:{
            type:String,
            required:true,
            uppercase:true,
            trim:true
        },

        vehicleType:{
            type:String,
            enum: ["car","bike"],
            required:true
        },

        parkingSlot:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"ParkingSlot",
            required:true
        },

        entryTime:{
            type:Date,
            required:true
        },

        exitTime:{
            type:Date,
            required:true
        },

        durationMinutes:{
            type:Number,
            required:true
        },

        amount:{
            type:Number,
            required:true
        },

        paymentMethod:{
            type:String,
            enum:["cash","upi"],
            required:true
        },

        paymentStatus:{
            type:String,
            enum:["paid"],
            default:"paid"
        },

        billDate:{
            type:Date,
            default:Date.now
        }
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model("Bill",billSchema);