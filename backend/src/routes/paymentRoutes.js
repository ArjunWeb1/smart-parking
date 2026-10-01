const express = require("express");

const router = express.Router();

const Payment = require("../models/Payment");
const ParkingSession = require("../models/ParkingSession");
const Booking = require("../models/Booking");

// Create Payment
router.post("/create", async (req, res) => {
    try {
        const { sessionId, paymentMethod } = req.body;

        if (!sessionId || !paymentMethod) {
            return res.status(400).json({
                message: "Session ID and payment method are required"
            });
        }

        if (!["cash", "upi"].includes(paymentMethod)) {
            return res.status(400).json({
                message: "Payment method must be cash or upi"
            });
        }

        const session = await ParkingSession.findById(sessionId);

        if (!session) {
            return res.status(404).json({
                message: "Parking session not found"
            });
        }

        console.log("PAYMENT SESSION:", session);

        if (session.status !== "completed") {
            return res.status(400).json({
                message: "Parking session must be completed first",
                currentStatus: session.status
            });
        }

        const booking = await Booking.findById(session.booking);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        const durationMs = session.exitTime - session.entryTime;

        const durationMinutes = Math.ceil(
            durationMs / (1000 * 60)
        );

        const parkingHours = Math.ceil(
            durationMinutes / 60
        );

        let hourlyRate;

        if (booking.vehicleType === "car") {
            hourlyRate = 20;
        } else {
            hourlyRate = 10;
        }

        let amount = parkingHours * hourlyRate;

        if (booking.vehicleType === "car" && amount > 100) {
            amount = 100;
        }

        if (booking.vehicleType === "bike" && amount > 50) {
            amount = 50;
        }

        const payment = await Payment.create({
            booking: session.booking,
            amount: amount,
            paymentMethod: paymentMethod,
            paymentStatus: "pending"
        });

        res.status(201).json({
            message: "Payment created",
            vehicleType: booking.vehicleType,
            durationMinutes: durationMinutes,
            parkingHours: parkingHours,
            hourlyRate: hourlyRate,
            amount: amount,
            payment
        });

    } catch (error) {
        console.error("PAYMENT ERROR:", error);

        res.status(500).json({
            message: "Failed to create payment",
            error: error.message
        });
    }
});


// Confirm Payment
router.put("/:id/confirm", async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        payment.paymentStatus = "paid";
        payment.paymentTime = new Date();

        await payment.save();

        res.status(200).json({
            message: "Payment successful",
            payment
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to confirm payment",
            error: error.message
        });
    }
});


module.exports = router;