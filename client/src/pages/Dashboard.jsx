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
    ["Completed Orders", data.orders.filter(o => o.status === "Completed").length],
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Manufacturing Transport Dashboard</h2>
      <div className="grid grid-cols-4 gap-5">
        {cards.map(([title, value]) => (
          // <div className="bg-white p-6 rounded-2xl shadow" key={title}>
          <div
  className="bg-white rounded-2xl shadow-lg hover:scale-105 transition p-6"
  key={title}
>
            <p className="text-gray-500">{title}</p>
            {/* <h3 className="text-3xl font-bold mt-2">{value}</h3> */}
            <h3 className="text-4xl font-bold text-blue-600 mt-2">{value}</h3>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl shadow p-6 mt-6">
        <h3 className="text-xl font-bold mb-3">Project Workflow</h3>
        <p>Admin adds vehicles, creates orders, schedules deliveries, assigns vehicle, and tracks delivery status manually.</p>
      </div>
    </div>
  );
}
