const ParkingSlot = require("../models/ParkingSlot");

const createSlot = async (req, res) => {
    try {
        const {
            slotNumber,
            zone,
            vehicleType,
            isEV,
            status
        } = req.body;

        if (!slotNumber || !zone || !vehicleType) {
            return res.status(400).json({
                message: "Slot number, zone, and vehicle type are required"
            });
        }

        const existingSlot = await ParkingSlot.findOne({
            slotNumber
        });

        if (existingSlot) {
            return res.status(409).json({
                message: "Parking slot already exists"
            });
        }

        const slot = await ParkingSlot.create({
            slotNumber,
            zone,
            vehicleType,
            isEV: isEV ?? false,
            status: status || "available"
        });

        res.status(201).json({
            message: "Parking slot created successfully",
            slot
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create parking slot",
            error: error.message
        });
    }
};

const getAllSlots = async (req, res) => {
    try {
        const slots = await ParkingSlot.find();

        res.status(200).json({
            count: slots.length,
            slots
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to get parking slots",
            error: error.message
        });
    }
};

const getSlot = async (req, res) => {
    try {
        const slot = await ParkingSlot.findById(req.params.id);

        if (!slot) {
            return res.status(404).json({
                message: "Parking slot not found"
            });
        }

        res.status(200).json({
            slot
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to get parking slot",
            error: error.message
        });
    }
};

const updateSlot = async (req, res) => {
    try {
        const slot = await ParkingSlot.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!slot) {
            return res.status(404).json({
                message: "Parking slot not found"
            });
        }

        res.status(200).json({
            message: "Parking slot updated successfully",
            slot
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update parking slot",
            error: error.message
        });
    }
};

const deleteSlot = async (req, res) => {
    try {
        const slot = await ParkingSlot.findByIdAndDelete(
            req.params.id
        );

        if (!slot) {
            return res.status(404).json({
                message: "Parking slot not found"
            });
        }

        res.status(200).json({
            message: "Parking slot deleted successfully",
            slot
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete parking slot",
            error: error.message
        });
    }
};

module.exports = {
    createSlot,
    getAllSlots,
    getSlot,
    updateSlot,
    deleteSlot
};