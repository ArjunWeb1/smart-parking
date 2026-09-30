const mongoose = require("mongoose");
const waitingQueueSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true
        },

        phone:{
            type:String,
            required:true,
            trim:true
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

        position:{
            type:Number,
            required:true
        },

        status:{
            type:String,
            enum:["waiting","assigned","cancelled"],
            default:"waiting"
        }
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model("waitingQueue",waitingQueueSchema);