const mongoose = require("mongoose");

const parkingSlotSchema = new mongoose.Schema(
    {
        slotNumber:{
            type:String,
            required:true,
            unique:true
        },
        zone:{
            type:String,
            requried:true
        },
        vehicleType:{
            type:String,
            enum:["car","bike"],
            requried:true
        },
        isEV:{
            type:Boolean,
            default:false
        },
        status:{
            type:String,
            enum:["available","occupied","maintenance"],
            default:"available"
        }
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model("ParkingSlot",parkingSlotSchema);