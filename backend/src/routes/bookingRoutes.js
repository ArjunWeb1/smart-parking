const express = require("express");

const router = express.Router();

const Booking = require("../models/Booking");
const ParkingSlot = require("../models/ParkingSlot");
const WaitingQueue = require("../models/WaitingQueue");

// Create Public Booking
router.post("/", async (req, res) => {
    try {
        const {
            name,
            phone,
            vehicleNumber,
            vehicleType,
            parkingSlot,
            bookingDate
        } = req.body;

        if (
            !name ||
            !phone ||
            !vehicleNumber ||
            !vehicleType ||
            !parkingSlot ||
            !bookingDate
        ) {
            return res.status(400).json({
                message: "All booking details are required"
            });
        }

        const slot = await ParkingSlot.findById(parkingSlot);

        if (!slot) {
            return res.status(404).json({
                message: "Parking slot not found"
            });
        }

        // Only public parking can be booked
        if (slot.parkingType !== "public") {
            return res.status(400).json({
                message: "Only public parking slots can be booked"
            });
        }

        // Vehicle type must match slot
        if (slot.vehicleType !== vehicleType) {
            return res.status(400).json({
                message: "Vehicle type does not match this parking slot"
            });
        }

        // Check if selected slot is unavailable
        if (slot.status !== "available") {

            // Check another matching public slot
            const availableSlot = await ParkingSlot.findOne({
                parkingType: "public",
                vehicleType: vehicleType,
                status: "available"
            });

            // Another slot is available
            if (availableSlot) {
                return res.status(400).json({
                    message: "Selected slot is not available. Please choose another available slot",
                    availableSlot: availableSlot.slotNumber
                });
            }

            // Check if vehicle is already in queue
            const existingQueue = await WaitingQueue.findOne({
                phone,
                vehicleNumber: vehicleNumber.toUpperCase(),
                status: "waiting"
            });

            if (existingQueue) {
                return res.status(409).json({
                    message: "Vehicle is already in the waiting queue",
                    queuePosition: existingQueue.position
                });
            }

            // Get next queue position
            const queueCount = await WaitingQueue.countDocuments({
                vehicleType,
                status: "waiting"
            });

            // Create queue entry
            const queueEntry = await WaitingQueue.create({
                name,
                phone,
                vehicleNumber,
                vehicleType,
                position: queueCount + 1
            });

            return res.status(201).json({
                message: "No public slot is available. Added to waiting queue",
                queuePosition: queueEntry.position,
                queueEntry
            });
        }

        // Slot is available → create booking
        const booking = await Booking.create({
            name,
            phone,
            vehicleNumber,
            vehicleType,
            parkingSlot,
            bookingDate
        });

        // Reserve the slot
        slot.status = "reserved";
        await slot.save();

        res.status(201).json({
            message: "Public parking booking created successfully",
            booking
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create public booking",
            error: error.message
        });
    }
});


// Get All Bookings
router.get("/", async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("parkingSlot");

        res.status(200).json({
            count: bookings.length,
            bookings
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch bookings",
            error: error.message
        });
    }
});


module.exports = router;