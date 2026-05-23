const express = require("express");
const Order = require("../models/Order");
const protect = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

router.get("/", async (req, res) => res.json(await Order.find().sort({ createdAt: -1 })));

router.post("/", async (req, res) => {
  const order = await Order.create(req.body);
  res.status(201).json(order);
});

router.put("/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(order);
});

router.delete("/:id", async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ message: "Order deleted" });
});

module.exports = router;
