const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    vehicleNumber: { type: String, required: true, unique: true },
    vehicleType: { type: String, required: true },
    driverName: { type: String, required: true },
    driverPhone: { type: String },

    status: {
      type: String,
      enum: ["Available", "On Trip", "Maintenance"],
      default: "Available"
    },

    currentLocation: { 
      type: String, 
      default: "Factory" 
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
