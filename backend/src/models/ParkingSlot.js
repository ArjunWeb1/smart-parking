const mongoose = require("mongoose");

const parkingSlotSchema = new mongoose.Schema(
    {
        slotNumber: {
            type: String,
            required: true,
            unique: true
        },

        zone: {
            type: String,
            required: true
        },

        parkingType: {
            type: String,
            enum: ["campus", "public"],
            required: true
        },

        vehicleType: {
            type: String,
            enum: ["car", "bike"],
            required: true
        },

        isEV: {
            type: Boolean,
            default: false
        },

        status: {
            type: String,
            enum: ["available", "reserved", "occupied", "maintenance"],
            default: "available"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("ParkingSlot", parkingSlotSchema);