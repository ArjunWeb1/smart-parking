const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        vehicleNumber: {
            type: String,
            required: true,
            uppercase: true,
            trim: true
        },

        vehicleType: {
            type: String,
            enum: ["car", "bike"],
            required: true
        },

        parkingSlot: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ParkingSlot",
            required: true
        },

        bookingDate: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: ["confirmed", "cancelled", "completed"],
            default: "confirmed"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Booking", bookingSchema);