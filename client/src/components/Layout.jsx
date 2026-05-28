import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Truck, LayoutDashboard, Package, MapPin, ClipboardList } from "lucide-react";

export default function Layout() {
  const navigate = useNavigate();
  const role = (localStorage.getItem("role") || "Admin").trim();
  const name = localStorage.getItem("name") || "User";

const nav =
  role === "Driver"
    ? [
        ["Dashboard", "/", <LayoutDashboard size={18} />],
        ["Deliveries", "/deliveries", <Package size={18} />],
        ["Tracking", "/tracking", <MapPin size={18} />],
      ]
    : role === "Manager"
    ? [
        ["Dashboard", "/", <LayoutDashboard size={18} />],
        ["Deliveries", "/deliveries", <Package size={18} />],
        ["Orders", "/orders", <ClipboardList size={18} />],
        ["Tracking", "/tracking", <MapPin size={18} />],
      ]
    : [
        ["Dashboard", "/", <LayoutDashboard size={18} />],
        ["Vehicles", "/vehicles", <Truck size={18} />],
        ["Deliveries", "/deliveries", <Package size={18} />],
        ["Orders", "/orders", <ClipboardList size={18} />],
        ["Tracking", "/tracking", <MapPin size={18} />],
      ];
      
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-slate-900 text-white p-5">
        <h1 className="text-xl font-bold mb-8">Transport System</h1>
<div className="mb-6 bg-slate-800 p-3 rounded-lg">
  <p className="font-bold">👤 {name}</p>
  <p className="text-sm text-gray-300">
    Role: {role}
  </p>
</div>
        <div className="space-y-3">
          {nav.map(([name, path, icon]) => (
            <Link
              key={path}
              to={path}
              className="flex gap-3 items-center p-3 rounded-lg hover:bg-slate-700"
            >
              {icon} {name}
            </Link>
          ))}
        </div>

        <button
          onClick={logout}
          className="mt-10 bg-red-500 px-4 py-2 rounded-lg w-full"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}