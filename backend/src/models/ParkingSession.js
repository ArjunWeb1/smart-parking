const mongoose = require("mongoose");
const parkingSessionShcema = new mongoose.Schema(
    {
        booking:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Booking",
            required:true
        },

        parkingSlot:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"ParkingSlot",
            required:true
        },

        vehicleNumber:{
            type:String,
            required:true,
            uppercase:true,
            trim:true
        },

        entryTime:{
            type:Date,
            default:Date.now
        },
        
        exitTime:{
            type:Date,
            defualt:null
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