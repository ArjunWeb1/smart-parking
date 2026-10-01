const mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema(
    {
        booking:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Booking",
            required:true
        },

        amount:{
            type:Number,
            requried:true
        },

        paymentMethod:{
            type:String,
            enum:["cash","upi"],
            required:true
        },

        paymentStatus:{
            type:String,
            enum:["pending","paid","failed"],
            default:"pending"
        },

        paymentTime:{
            type:Date,
            defualt:null
        },
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model("Payment",paymentSchema);