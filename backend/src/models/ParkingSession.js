const mongoose = require("mongoose");
const parkingSessionShcema = new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required: true
        },

        vehicle:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Vehicle",
            required:true
        },

        parkingSlot:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"ParkingSlot",
            required:true
        },

        booking:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Booking",
            required:true
        },

        entryTime:{
            type:Date,
            default:Date.now
        },

        exitTime:{
            type:Date,
            default:null
        },

        status:{
            type:String,
            enum:["active","completed"],
            default:"active"
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("ParkingSession",parkingSessionShcema);