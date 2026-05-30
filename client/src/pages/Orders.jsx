import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const role = localStorage.getItem("role") || "Admin";
  const [form, setForm] = useState({
    
    orderId: "",
    customerName: "",
    customerPhone: "",
    material: "",
    quantity: "",
    destination: "",
    priority: "Medium",
    expectedDeliveryDate: ""
  });

  const load = () => API.get("/orders").then(res => setOrders(res.data));

  useEffect(() => {
    load();
  }, []);

  const add = async (e) => {
    e.preventDefault();

    await API.post("/orders", form);
    toast.success("Order added successfully 📦");

    setForm({
      orderId: "",
      customerName: "",
      customerPhone: "",
      material: "",
      quantity: "",
      destination: "",
      priority: "Medium",
      expectedDeliveryDate: ""
    });

    load();
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Logistics Orders</h2>

      <input
        className="border p-3 rounded-lg mb-4 w-full"
        placeholder="Search orders by customer or material..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {role === "Manager" && (
  <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-xl mb-4">
    Manager access: You can view and monitor orders, but only Admin can create new orders.
  </div>
)}
       {role === "Admin" && (
      <form onSubmit={add} className="bg-white p-5 rounded-2xl shadow grid grid-cols-4 gap-3 mb-6">
        <input className="border p-2 rounded" placeholder="Order ID" value={form.orderId} onChange={e => setForm({ ...form, orderId: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Customer" value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Customer Phone" value={form.customerPhone} onChange={e => setForm({ ...form, customerPhone: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Material" value={form.material} onChange={e => setForm({ ...form, material: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Qty" type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Destination" value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} />

        <select className="border p-2 rounded" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <input className="border p-2 rounded" type="date" value={form.expectedDeliveryDate} onChange={e => setForm({ ...form, expectedDeliveryDate: e.target.value })} />

        <button className="bg-slate-900 text-white rounded p-2">
          Add Order
        </button>
      </form>
      )}

      <div className="grid gap-4">
        {orders
          .filter(o =>
            o.material?.toLowerCase().includes(search.toLowerCase()) ||
            o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
            o.orderId?.toLowerCase().includes(search.toLowerCase())
          )
          .map(o => (
            <div className="bg-white p-5 rounded-2xl shadow" key={o._id}>
              <h3 className="font-bold">{o.orderId} - {o.customerName}</h3>

              <p>{o.material} | Qty: {o.quantity}</p>
              <p>Destination: {o.destination}</p>
              <p>Phone: {o.customerPhone || "N/A"}</p>

              <p>
                Priority:
                <span
                  className={
                    o.priority === "High"
                      ? "text-red-600 font-bold"
                      : o.priority === "Medium"
                      ? "text-yellow-600 font-bold"
                      : "text-green-600 font-bold"
                  }
                >
                  {" "}{o.priority}
                </span>
              </p>

              <p>Expected Delivery: {o.expectedDeliveryDate || "N/A"}</p>
              <p>Status: {o.status}</p>
            </div>
          ))}
      </div>
    </div>
  );
}