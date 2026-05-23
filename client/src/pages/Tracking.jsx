import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function Tracking() {
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    API.get("/deliveries").then(res => setDeliveries(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Vehicle Tracking</h2>
      <div className="grid gap-4">
        {deliveries.map(d => (
          <div className="bg-white p-5 rounded-2xl shadow" key={d._id}>
            <h3 className="text-xl font-bold">{d.deliveryId}</h3>
            <p className="mt-2">Route: {d.pickupLocation} → {d.dropLocation}</p>
            <p>Vehicle: {d.vehicle?.vehicleNumber || "Not assigned"}</p>
            <p>Driver: {d.vehicle?.driverName || "N/A"}</p>
            <p>Current Location: {d.vehicle?.currentLocation || "N/A"}</p>
            <p>Status: <span className="font-bold">{d.status}</span></p>
            <div className="mt-4 bg-gray-200 rounded-full h-3">
              <div className="bg-slate-900 h-3 rounded-full" style={{ width: d.status === "Delivered" ? "100%" : d.status === "In Transit" ? "60%" : "25%" }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
