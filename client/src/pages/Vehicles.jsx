import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ vehicleNumber: "", vehicleType: "", driverName: "", driverPhone: "", currentLocation: "Factory" });

  const load = async () => {
  setLoading(true);

  try {
    const res = await API.get("/vehicles");
    setVehicles(res.data);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    await API.post("/vehicles", form);
    toast.success("Vehicle added successfully 🚚");
    setForm({ vehicleNumber: "", vehicleType: "", driverName: "", driverPhone: "", currentLocation: "Factory" });
    load();
  };

  return (
    
    <div>
      <input
  className="border p-3 rounded-lg mb-4 w-full"
  placeholder="Search vehicle by number, type, driver..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>
      <h2 className="text-3xl font-bold mb-6">Vehicle Management</h2>
      <form onSubmit={add} className="bg-white p-5 rounded-2xl shadow grid grid-cols-5 gap-3 mb-6">
        <input className="border p-2 rounded" placeholder="Vehicle No." value={form.vehicleNumber} onChange={e=>setForm({...form,vehicleNumber:e.target.value})}/>
        <input className="border p-2 rounded" placeholder="Type" value={form.vehicleType} onChange={e=>setForm({...form,vehicleType:e.target.value})}/>
        <input className="border p-2 rounded" placeholder="Driver" value={form.driverName} onChange={e=>setForm({...form,driverName:e.target.value})}/>
        <input className="border p-2 rounded" placeholder="Phone" value={form.driverPhone} onChange={e=>setForm({...form,driverPhone:e.target.value})}/>
        <button className="bg-slate-900 text-white rounded">Add Vehicle</button>
      </form>
{loading && (
  <div className="text-center font-semibold text-blue-600 mb-4">
    Loading vehicles...
  </div>
)}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-900 text-white"><tr><th className="p-3">Vehicle</th><th>Type</th><th>Driver</th><th>Status</th><th>Location</th></tr></thead>
          <tbody>
{
  vehicles
    .filter(v =>
      v.vehicleNumber.toLowerCase().includes(search.toLowerCase()) ||
      v.vehicleType.toLowerCase().includes(search.toLowerCase()) ||
      v.driverName.toLowerCase().includes(search.toLowerCase())
    )
    .map(v =>
      <tr className="border-b text-center" key={v._id}>
        <td className="p-3">{v.vehicleNumber}</td>
        <td>{v.vehicleType}</td>
        <td>{v.driverName}</td>
        <td>{v.status}</td>
        <td>{v.currentLocation}</td>
      </tr>
    )
}
</tbody>
        </table>
      </div>
    </div>
  );
}
