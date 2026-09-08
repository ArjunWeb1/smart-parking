const mongoose = require("mongoose");
const vehicleSchema = new mongoose.Schema(
    {
        vehicleNumber:{
            type:String,
            requried:true,
            unique:true,
            uppercase:true,
            trim:true
        },
        vehicleType:{
            type:String,
            enum:["car","bike"],
            required:true
        },
        fuelType:{
            type:String,
            enum:["petrol","diesel","EV","CNG"],
            required:true
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        }
    },
    {
        timestamps:true
    }
);
module.exports = mongoose.model("Vehicle",vehicleSchema);