const express = require("express");
const Vehicle = require("../models/Vehicle");
const protect = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

router.get("/", async (req, res) => {
  const vehicles = await Vehicle.find({
    user: req.user.id
  }).sort({ createdAt: -1 });

  res.json(vehicles);
});

router.post("/", async (req, res) => {
  const vehicle = await Vehicle.create({
    ...req.body,
    user: req.user.id
  });

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
