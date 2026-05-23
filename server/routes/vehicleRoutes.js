const express = require("express");
const Vehicle = require("../models/Vehicle");
const protect = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

router.get("/", async (req, res) => res.json(await Vehicle.find().sort({ createdAt: -1 })));

router.post("/", async (req, res) => {
  const vehicle = await Vehicle.create(req.body);
  res.status(201).json(vehicle);
});

router.put("/:id", async (req, res) => {
  const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(vehicle);
});

router.delete("/:id", async (req, res) => {
  await Vehicle.findByIdAndDelete(req.params.id);
  res.json({ message: "Vehicle deleted" });
});

module.exports = router;
