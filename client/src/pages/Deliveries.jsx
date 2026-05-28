import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import API from "../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Deliveries() {
  const role = localStorage.getItem("role") || "Admin";
  const name = localStorage.getItem("name");
  const [deliveries, setDeliveries] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ deliveryId: "", productName: "", pickupLocation: "", dropLocation: "", deliveryDate: "", vehicle: "" });
  
  
  const load = () => {
    API.get("/deliveries").then(res => setDeliveries(res.data));
    API.get("/vehicles").then(res => setVehicles(res.data));
  };
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    await API.post("/deliveries", form);
    toast.success("Delivery scheduled successfully 🚚");
    setForm({ deliveryId: "", productName: "", pickupLocation: "", dropLocation: "", deliveryDate: "", vehicle: "" });
    load();
  };

  const updateStatus = async (id, status) => {
    await API.put(`/deliveries/${id}`, { status, trackingNote: `Status updated to ${status}` });
    toast.success(`Delivery status updated to ${status}`);
    load();
  };
  const filteredDeliveries = deliveries.filter(d =>
  role === "Driver"
    ? d.vehicle?.driverName === name
    : true
);
  const downloadReport = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Delivery Report", 14, 20);

  const tableData = filteredDeliveries.map((d, index) => [
    index + 1,
    d.deliveryId,
    d.productName,
    d.pickupLocation,
    d.dropLocation,
    d.vehicle?.vehicleNumber || "Not assigned",
    d.status
  ]);

  autoTable(doc, {
    head: [["#", "Delivery ID", "Product", "Pickup", "Drop", "Vehicle", "Status"]],
    body: tableData,
    startY: 30
  });

  doc.save("delivery-report.pdf");
};

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Delivery Scheduling</h2>
    {role !== "Driver" && (
  <button
    onClick={downloadReport}
    className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4"
  >
    Download Delivery Report
  </button>
)}
{role !== "Driver" && (
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
)}
      <div className="grid gap-4">
        {filteredDeliveries
  .filter(d =>
    d.deliveryId?.toLowerCase().includes(search.toLowerCase()) ||
    d.productName?.toLowerCase().includes(search.toLowerCase())
  )
  .map(d => (
          <div className="bg-white p-5 rounded-2xl shadow" key={d._id}>
            <div className="flex justify-between">
              <div>
                <h3 className="font-bold text-lg">{d.deliveryId} - {d.productName}</h3>
                <p>{d.pickupLocation} → {d.dropLocation}</p>
                <p>Vehicle: {d.vehicle?.vehicleNumber || "Not assigned"}</p>
              </div>
             <div className="flex flex-col items-end gap-2">
  <span
    className={
      d.status === "Delivered"
        ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold"
        : d.status === "In Transit"
        ? "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold"
        : d.status === "Cancelled"
        ? "bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold"
        : "bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold"
    }
  >
    {d.status}
  </span>

  {role === "Driver" ? (
  <span className="bg-gray-100 px-3 py-2 rounded-lg font-bold">
    {d.status}
  </span>
) : (
  <select
    className="border p-2 rounded h-10"
    value={d.status}
    onChange={e => updateStatus(d._id, e.target.value)}
  >
    <option>Pending</option>
    <option>In Transit</option>
    <option>Delivered</option>
    <option>Cancelled</option>
  </select>
)}
</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
