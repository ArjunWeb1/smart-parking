const Vehicle = require('../models/Vehicle');

const addVehicle = async(req,res)=>{
    try{
        const {vehicleNumber, vehicleType,fuelType,owner}=req.body;

        if(!vehicleNumber || !vehicleType || !fuelType){
            return res.status(400).json({
                message:"All vehicle fields are required"
            });
        }

        const existingVehicle = await Vehicle.findOne({
            vehicleNumber:vehicleNumber.toUpperCase()
        });

        if(existingVehicle){
            return res.status(409).json({
                message:"Vehicle already registered"
            });
        }

        const vehicle = await Vehicle.create({
            vehicleNumber,
            vehicleType,
            fuelType,
            owner:req.user.id
        });

        res.status(201).json({
            message:"Vehicle added successfully",
            vehicle
        });

    }catch(error){
        res.status(500).json({
            message:"failed to add vehicle",
            error:error.message
        });
    }
};

//Get user's vehicles
const getMyVehicles = async(req,res)=>{
    try{
        const vehicles = await Vehicle.find({
            owner:req.user.id   
        });
        res.status(200).json({
            count:vehicles.length,
            vehicles
        });
    }catch(error){
        res.status(500).json({
            message:"Failed to fetch vehicles",
            error:error.message
        });
    }
};

//Delete vehicle
const deleteVehicle = async(req,res)=>{
    try{
        const vehicle = await Vehicle.findOneAndDelete({
            _id:req.params.id,
            owner:req.user.id
        });
        if(!vehicle){
            return res.status(404).json({
                message:"Vehicle not found"
            });
        }
        res.status(200).json({
            message:"Vehicle deleted successfully"
        });
    }catch(error){
        res.status(500).json({
            message:"Failed to delete vehicle",
            error:error.message
        });
    }

};
// Update vehicle
const updateVehicle = async (req, res) => {
    try {
        const { vehicleNumber, vehicleType, fuelType } = req.body;

        const vehicle = await Vehicle.findOneAndUpdate(
            {
                _id: req.params.id,
                owner: req.user.id
            },
            {
                vehicleNumber,
                vehicleType,
                fuelType
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!vehicle) {
            return res.status(404).json({
                message: "Vehicle not found"
            });
        }

        res.status(200).json({
            message: "Vehicle updated successfully",
            vehicle
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update vehicle",
            error: error.message
        });
    }
};

module.exports = {
    addVehicle,
    getMyVehicles,
    deleteVehicle,
    updateVehicle
};