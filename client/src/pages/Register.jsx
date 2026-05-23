import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      alert("Registered successfully");
      navigate("/login");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form onSubmit={submit} className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-6">Create Account</h2>
        <input className="border p-3 w-full mb-3 rounded" placeholder="Name" onChange={e => setForm({...form, name:e.target.value})} />
        <input className="border p-3 w-full mb-3 rounded" placeholder="Email" onChange={e => setForm({...form, email:e.target.value})} />
        <input className="border p-3 w-full mb-3 rounded" type="password" placeholder="Password" onChange={e => setForm({...form, password:e.target.value})} />
        <button className="bg-slate-900 text-white p-3 rounded w-full">Register</button>
        <p className="mt-4 text-sm">Already have account? <Link className="text-blue-600" to="/login">Login</Link></p>
      </form>
    </div>
  );
}
