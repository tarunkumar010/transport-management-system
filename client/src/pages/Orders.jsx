import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ orderId: "", customerName: "", material: "", quantity: "", destination: "" });

  const load = () => API.get("/orders").then(res => setOrders(res.data));
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    await API.post("/orders", form);
    setForm({ orderId: "", customerName: "", material: "", quantity: "", destination: "" });
    load();
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Logistics Orders</h2>
      <form onSubmit={add} className="bg-white p-5 rounded-2xl shadow grid grid-cols-5 gap-3 mb-6">
        <input className="border p-2 rounded" placeholder="Order ID" value={form.orderId} onChange={e=>setForm({...form,orderId:e.target.value})}/>
        <input className="border p-2 rounded" placeholder="Customer" value={form.customerName} onChange={e=>setForm({...form,customerName:e.target.value})}/>
        <input className="border p-2 rounded" placeholder="Material" value={form.material} onChange={e=>setForm({...form,material:e.target.value})}/>
        <input className="border p-2 rounded" placeholder="Qty" type="number" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})}/>
        <input className="border p-2 rounded" placeholder="Destination" value={form.destination} onChange={e=>setForm({...form,destination:e.target.value})}/>
        <button className="bg-slate-900 text-white rounded p-2">Add Order</button>
      </form>

      <div className="grid gap-4">
        {orders.map(o => (
          <div className="bg-white p-5 rounded-2xl shadow" key={o._id}>
            <h3 className="font-bold">{o.orderId} - {o.customerName}</h3>
            <p>{o.material} | Qty: {o.quantity} | Destination: {o.destination}</p>
            <p>Status: {o.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
