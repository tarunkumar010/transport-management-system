import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function Deliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({ deliveryId: "", productName: "", pickupLocation: "", dropLocation: "", deliveryDate: "", vehicle: "" });

  const load = () => {
    API.get("/deliveries").then(res => setDeliveries(res.data));
    API.get("/vehicles").then(res => setVehicles(res.data));
  };
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    await API.post("/deliveries", form);
    setForm({ deliveryId: "", productName: "", pickupLocation: "", dropLocation: "", deliveryDate: "", vehicle: "" });
    load();
  };

  const updateStatus = async (id, status) => {
    await API.put(`/deliveries/${id}`, { status, trackingNote: `Status updated to ${status}` });
    load();
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Delivery Scheduling</h2>
      <form onSubmit={add} className="bg-white p-5 rounded-2xl shadow grid grid-cols-3 gap-3 mb-6">
        <input className="border p-2 rounded" placeholder="Delivery ID" value={form.deliveryId} onChange={e=>setForm({...form,deliveryId:e.target.value})}/>
        <input className="border p-2 rounded" placeholder="Product" value={form.productName} onChange={e=>setForm({...form,productName:e.target.value})}/>
        <input className="border p-2 rounded" placeholder="Pickup" value={form.pickupLocation} onChange={e=>setForm({...form,pickupLocation:e.target.value})}/>
        <input className="border p-2 rounded" placeholder="Drop" value={form.dropLocation} onChange={e=>setForm({...form,dropLocation:e.target.value})}/>
        <input className="border p-2 rounded" type="date" value={form.deliveryDate} onChange={e=>setForm({...form,deliveryDate:e.target.value})}/>
        <select className="border p-2 rounded" value={form.vehicle} onChange={e=>setForm({...form,vehicle:e.target.value})}>
          <option value="">Assign Vehicle</option>
          {vehicles.map(v => <option key={v._id} value={v._id}>{v.vehicleNumber} - {v.driverName}</option>)}
        </select>
        <button className="bg-slate-900 text-white rounded p-2">Create Delivery</button>
      </form>

      <div className="grid gap-4">
        {deliveries.map(d => (
          <div className="bg-white p-5 rounded-2xl shadow" key={d._id}>
            <div className="flex justify-between">
              <div>
                <h3 className="font-bold text-lg">{d.deliveryId} - {d.productName}</h3>
                <p>{d.pickupLocation} → {d.dropLocation}</p>
                <p>Vehicle: {d.vehicle?.vehicleNumber || "Not assigned"}</p>
              </div>
              <select className="border p-2 rounded h-10" value={d.status} onChange={e=>updateStatus(d._id, e.target.value)}>
                <option>Pending</option><option>In Transit</option><option>Delivered</option><option>Cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
