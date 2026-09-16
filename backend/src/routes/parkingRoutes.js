const express = require("express");
const router = express.Router();

const {
    createSlot,
    getAllSlots,
    getSlot,
    updateSlot
} = require("../controllers/parkingController");

const protect = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/slots",protect,getAllSlots);

router.get("/slots/:id",protect,getSlot);

router.post("/slots",protect,adminMiddleware,createSlot);

router.put("/slots/:id",protect,adminMiddleware,updateSlot);

module.exports = router;