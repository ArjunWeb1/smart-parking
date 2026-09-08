const express = require("express");
const{
    addVehicle, 
    getMyVehicles,
    deleteVehicle,
    updateVehicle
} = require("../controllers/vehicleController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/",protect,addVehicle);
router.get("/",protect,getMyVehicles);
router.delete("/:id",protect,deleteVehicle);
router.put("/:id",protect,updateVehicle);
module.exports = router;
