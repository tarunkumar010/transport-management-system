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
      localStorage.setItem("name", res.data.user.name);
      localStorage.setItem("role", res.data.user?.role || "Admin");
console.log("LOGIN USER:", res.data.user);
      navigate("/");
    } catch {
      alert("Login failed");
    }
  };

  return (
<div
  className="min-h-screen flex items-center justify-center bg-cover bg-center"
  style={{
    backgroundImage:
      "url('https://images.unsplash.com/photo-1473445730015-841f29a9490b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
  }}
>
      <form onSubmit={submit} className="bg-white/85 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-96">
         <h2 className="text-2xl font-bold mb-2">
  Welcome Back 👋
</h2>

<p className="text-gray-500 mb-6">
  Access your Transport Dashboard
</p>
        <input className="border p-3 w-full mb-3 rounded" placeholder="Email" onChange={e => setForm({...form, email:e.target.value})} />
        <input className="border p-3 w-full mb-3 rounded" type="password" placeholder="Password" onChange={e => setForm({...form, password:e.target.value})} />

        <button
  className="bg-slate-900 hover:bg-black text-white p-3 rounded-xl w-full transition duration-300 shadow-lg hover:scale-[1.02]"
>
  Login
</button>
        <p className="mt-4 text-sm">No account? <Link className="text-blue-600" to="/register">Register</Link></p>
      </form>
    </div>
  );
}
