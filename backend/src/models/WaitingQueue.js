const Vehicle = require("./Vehicle");

const mongoose = requrie("mongoose");

const waitingQueueSchema = new mongoose.Shcema(
    {
        user:{
            type:mongoose.Shcema.Types.ObjectId,
            ref:"User",
            requried: true
        },

        vehicle:{
            type:mongoose.Shcema.Types.ObjectId,
            ref:"Vehicle",
            reuqired:true
        },

        vehicleType:{
            type:String,
            enum:["car","bike"],
            reuqired:true
        },

        position:{
            type:Number,
            requried:true
        },
        
        requestDate:{
            type:Date,
            default:Date.now
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
module.exports = mongoose.model("WaitingQueue",waitingQueueSchema);