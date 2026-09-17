const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
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
    bookingDate:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        enum:["confirmed","cancelled"],
        default:"confirmed"
    },

},
{
    timestamps:true
}
);

module.exports = mongoose.model("Booking",bookingSchema);