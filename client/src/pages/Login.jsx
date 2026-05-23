import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form onSubmit={submit} className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-6">Admin Login</h2>
        <input className="border p-3 w-full mb-3 rounded" placeholder="Email" onChange={e => setForm({...form, email:e.target.value})} />
        <input className="border p-3 w-full mb-3 rounded" type="password" placeholder="Password" onChange={e => setForm({...form, password:e.target.value})} />
        <button className="bg-slate-900 text-white p-3 rounded w-full">Login</button>
        <p className="mt-4 text-sm">No account? <Link className="text-blue-600" to="/register">Register</Link></p>
      </form>
    </div>
  );
}
