import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import API from "../services/api";
import L from "leaflet";

function RouteMap({ pickup, drop, status }) {
  const [route, setRoute] = useState([]);
  const [pickupCoord, setPickupCoord] = useState(null);
  const [dropCoord, setDropCoord] = useState(null);
  const [distanceKm, setDistanceKm] = useState(0);
  const [eta, setEta] = useState("");

  useEffect(() => {
    const getCoords = async (place) => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place + ", India")}`
      );
      const data = await res.json();
      if (!data.length) return null;
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    };

    const loadRoute = async () => {
      const start = await getCoords(pickup);
      const end = await getCoords(drop);

      if (!start || !end) return;

      setPickupCoord(start);
      setDropCoord(end);

      const routeRes = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
      );

      const routeData = await routeRes.json();
      const selectedRoute = routeData.routes[0];

      const coords = selectedRoute.geometry.coordinates.map((c) => [
        c[1],
        c[0]
      ]);

      setRoute(coords);
      setDistanceKm((selectedRoute.distance / 1000).toFixed(1));

      const minutesTotal = selectedRoute.duration / 60;
      const hours = Math.floor(minutesTotal / 60);
      const minutes = Math.round(minutesTotal % 60);
      setEta(`${hours}h ${minutes}m`);
    };

    loadRoute();
  }, [pickup, drop]);

  if (!pickupCoord || !dropCoord || route.length === 0) {
    return <p className="text-gray-500 mt-4">Loading route map...</p>;
  }

  const currentPosition = route[Math.floor(route.length / 2)];

  const progress =
    status === "Delivered"
      ? "100%"
      : status === "In Transit"
      ? "60%"
      : status === "Cancelled"
      ? "0%"
      : "25%";
     const pickupIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const vehicleIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/1048/1048329.png",
  iconSize: [55, 55],
  iconAnchor: [27, 27]
});


const dropIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

  return (
    <>
      <div className="mt-4 rounded-xl overflow-hidden border">
        <MapContainer
          center={pickupCoord}
          zoom={9}
          style={{ height: "320px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <Polyline
            positions={route}
            pathOptions={{
              color: status === "Cancelled" ? "#dc2626" : "#2563eb",
              weight: 6,
              opacity: 0.85
            }}
          />

<Marker position={pickupCoord} icon={pickupIcon}>
  <Popup>Pickup Location</Popup>
</Marker>

<Marker position={currentPosition} icon={vehicleIcon}>
  <Popup>Live Vehicle</Popup>
</Marker>

<Marker position={dropCoord} icon={dropIcon}>
  <Popup>Destination</Popup>
</Marker>
        </MapContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div className="bg-blue-50 text-blue-700 p-3 rounded-lg font-semibold">
          Distance: {distanceKm} km
        </div>

        <div className="bg-yellow-50 text-yellow-700 p-3 rounded-lg font-semibold">
          ETA: {eta}
        </div>

        <div className="bg-green-50 text-green-700 p-3 rounded-lg font-semibold">
          Progress: {progress}
        </div>
      </div>

      <div className="mt-6">
        <h4 className="font-bold mb-3">Delivery Timeline</h4>

        <div className="flex justify-between text-sm">
          <div className="text-center">
            <div className="w-4 h-4 rounded-full bg-green-500 mx-auto"></div>
            <p>Pickup</p>
          </div>

          <div className="text-center">
            <div className="w-4 h-4 rounded-full bg-yellow-500 mx-auto"></div>
            <p>On Route</p>
          </div>

          <div className="text-center">
            <div
              className={`w-4 h-4 rounded-full mx-auto ${
                status === "Delivered" ? "bg-green-500" : "bg-gray-300"
              }`}
            ></div>
            <p>Delivered</p>
          </div>
        </div>

        <div className="bg-gray-200 h-1 mt-2 rounded">
          <div
            className="bg-blue-600 h-1 rounded"
            style={{ width: progress }}
          ></div>
        </div>
      </div>
    </>
  );
}

export default function Tracking() {
  const [deliveries, setDeliveries] = useState([]);
  const [search, setSearch] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
const role = localStorage.getItem("role") || "Admin";
const name = localStorage.getItem("name") || "";
const filteredDeliveries = deliveries.filter(d =>
  role === "Driver"
    ? d.vehicle?.driverName === name
    : true
);
  useEffect(() => {
    const load = () => {
      API.get("/deliveries").then((res) => {
        setDeliveries(res.data);
        setLastUpdated(new Date().toLocaleTimeString());
      });
    };

    load();
    const interval = setInterval(load, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Vehicle Tracking</h2>

     {role !== "Driver" && (
  <input
    className="border p-3 rounded-lg mb-4 w-full"
    placeholder="Search delivery ID or product..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
)}

      <p className="text-sm text-gray-500 mb-4">
        Last updated: {lastUpdated}
      </p>

      <div className="grid gap-4">
        {filteredDeliveries
  .filter(
            (d) =>
              d.deliveryId?.toLowerCase().includes(search.toLowerCase()) ||
              d.productName?.toLowerCase().includes(search.toLowerCase())
          )
          .map((d) => (
            <div className="bg-white p-5 rounded-2xl shadow" key={d._id}>
              <h3 className="text-xl font-bold">{d.deliveryId}</h3>
              <p className="mt-2">
                Route: {d.pickupLocation} → {d.dropLocation}
              </p>
              <p>Vehicle: {d.vehicle?.vehicleNumber || "Not assigned"}</p>
              <p>Driver: {d.vehicle?.driverName || "N/A"}</p>

              <p className="mt-1">
                Status:{" "}
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
              </p>

              {d.status === "Pending" ? (
  <div className="bg-yellow-50 p-6 rounded-xl text-center mt-4">
    <h3 className="font-bold text-yellow-700">
      ⏳ Vehicle not started yet
    </h3>

    <p className="text-gray-500 mt-2">
      {/* Live tracking will begin when status changes to */}
      "Pending"
    </p>
  </div>
) : d.status === "Cancelled" ? (
  <div className="bg-red-50 p-6 rounded-xl text-center mt-4">
    <h3 className="font-bold text-red-700">
      ❌ Delivery Cancelled
    </h3>
  </div>
) : (
  <RouteMap
    pickup={d.pickupLocation}
    drop={d.dropLocation}
    status={d.status}
  />
)}
            </div>
          ))}
      </div>
    </div>
  );
}