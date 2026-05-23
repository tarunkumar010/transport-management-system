const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
  {
    deliveryId: { type: String, required: true, unique: true },
    productName: { type: String, required: true },
    pickupLocation: { type: String, required: true },
    dropLocation: { type: String, required: true },
    deliveryDate: { type: String, required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
    status: {
      type: String,
      enum: ["Pending", "In Transit", "Delivered", "Cancelled"],
      default: "Pending"
    },
    trackingNote: { type: String, default: "Delivery created" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Delivery", deliverySchema);
