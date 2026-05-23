const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    material: { type: String, required: true },
    quantity: { type: Number, required: true },
    destination: { type: String, required: true },
    status: {
      type: String,
      enum: ["New", "Scheduled", "Dispatched", "Completed"],
      default: "New"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
