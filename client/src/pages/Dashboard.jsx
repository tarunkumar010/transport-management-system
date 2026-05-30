import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [data, setData] = useState({ vehicles: [], deliveries: [], orders: [] });

  useEffect(() => {
    Promise.all([API.get("/vehicles"), API.get("/deliveries"), API.get("/orders")])
      .then(([v, d, o]) => setData({ vehicles: v.data, deliveries: d.data, orders: o.data }));
  }, []);

  const cards = [
    ["Total Vehicles", data.vehicles.length],
    ["Active Deliveries", data.deliveries.filter(d => d.status === "In Transit").length],
    ["Pending Deliveries", data.deliveries.filter(d => d.status === "Pending").length],
    ["Total Orders", data.orders.length],
    ["Completed Orders",
 data.deliveries.filter(
   d => d.status === "Delivered"
 ).length
],
  ];
const role = localStorage.getItem("role") || "Admin";
const name = localStorage.getItem("name") || "Driver";

const driverDeliveries = data.deliveries.filter(
  d => d.vehicle?.driverName === name
);

if (role === "Driver") {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Driver Dashboard</h2>

      {driverDeliveries.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-6 rounded-2xl shadow">
          <h3 className="text-xl font-bold mb-2">No delivery assigned yet</h3>
          <p>
            Your assigned deliveries will appear here when admin assigns a vehicle with your driver name.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-5 mb-6">
            <div className="bg-white p-6 rounded-2xl shadow">
              <p className="text-gray-500">Assigned Truck</p>
              <h3 className="text-2xl font-bold text-blue-600">
                {driverDeliveries[0]?.vehicle?.vehicleNumber || "Not Assigned"}
              </h3>
              <p className="text-sm text-gray-500 mt-2">
  Driver: {name}
</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <p className="text-gray-500">Today's Deliveries</p>
              <h3 className="text-2xl font-bold text-blue-600">
                {driverDeliveries.length}
              </h3>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <p className="text-gray-500">Current Route</p>
              <h3 className="text-lg font-bold text-blue-600">
                {driverDeliveries[0]
                  ? `${driverDeliveries[0].pickupLocation} → ${driverDeliveries[0].dropLocation}`
                  : "No Route"}
              </h3>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <p className="text-gray-500">Delivery Progress</p>
              <h3 className="text-2xl font-bold text-blue-600">
                {driverDeliveries[0]?.status || "No Delivery"}
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <div className="bg-white rounded-2xl shadow p-6 mt-6">
  <h3 className="text-xl font-bold mb-4">
    Delivery Timeline
  </h3>

  <div className="flex justify-between items-center">

    <div className="text-center">
      <div className="w-5 h-5 rounded-full bg-blue-500 mx-auto"></div>
      <p className="mt-2 text-sm">Pickup</p>
    </div>

    <div className="flex-1 h-1 bg-gray-200 mx-3 relative">
      <div
        className={`h-1 ${
          driverDeliveries[0]?.status === "Pending"
            ? "w-1/4 bg-blue-500"
            : driverDeliveries[0]?.status === "In Transit"
            ? "w-2/3 bg-yellow-500"
            : "w-full bg-green-500"
        }`}
      ></div>
    </div>

    <div className="text-center">
      <div
        className={`w-5 h-5 rounded-full mx-auto ${
          driverDeliveries[0]?.status === "In Transit" ||
          driverDeliveries[0]?.status === "Delivered"
            ? "bg-yellow-500"
            : "bg-gray-300"
        }`}
      ></div>

      <p className="mt-2 text-sm">On Route</p>
    </div>

    <div className="flex-1 h-1 bg-gray-200 mx-3 relative">
      <div
        className={`h-1 ${
          driverDeliveries[0]?.status === "Delivered"
            ? "w-full bg-green-500"
            : "w-0"
        }`}
      ></div>
    </div>

    <div className="text-center">
      <div
        className={`w-5 h-5 rounded-full mx-auto ${
          driverDeliveries[0]?.status === "Delivered"
            ? "bg-green-500"
            : "bg-gray-300"
        }`}
      ></div>

      <p className="mt-2 text-sm">Delivered</p>
    </div>

  </div>
</div>
            <h3 className="text-xl font-bold mb-3">Welcome, {name}</h3>
            <p>
              You can view your assigned deliveries and track current route from the Tracking page.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
  return (
  <div className="bg-gradient-to-r from-blue-700 via-slate-800 to-slate-900 rounded-3xl p-8 mb-8 text-white shadow-xl">
  <div className="flex justify-between items-center">
    <div>
      <h1 className="text-5xl font-extrabold mb-2">
         Transport Dashboard
      </h1>

      <p className="text-blue-100 text-lg">
        Real-Time Fleet, Delivery & Logistics Monitoring
      </p>
</div>

    <div className="text-right">
      <p className="text-sm text-gray-300">
        Welcome Back
      </p>

      <h3 className="text-2xl font-bold">
        {localStorage.getItem("name")}
      </h3>
    </div>
  </div>
</div>
  );
}
