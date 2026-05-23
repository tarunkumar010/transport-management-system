const express = require("express");
const Delivery = require("../models/Delivery");
const Vehicle = require("../models/Vehicle");
const protect = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

router.get("/", async (req, res) => {
  const deliveries = await Delivery.find().populate("vehicle").sort({ createdAt: -1 });
  res.json(deliveries);
});

router.post("/", async (req, res) => {
  const delivery = await Delivery.create(req.body);
  if (req.body.vehicle) {
    await Vehicle.findByIdAndUpdate(req.body.vehicle, { status: "On Trip" });
  }
  res.status(201).json(delivery);
});

router.put("/:id", async (req, res) => {
  const delivery = await Delivery.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(delivery);
});

router.delete("/:id", async (req, res) => {
  await Delivery.findByIdAndDelete(req.params.id);
  res.json({ message: "Delivery deleted" });
});

module.exports = router;
