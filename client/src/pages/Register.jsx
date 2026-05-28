import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Register() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Driver"
  });

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    console.log("Register form data:", form);

    try {

      await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role
      });

      alert("Registered successfully");

      navigate("/login");

    } catch {
      alert("Registration failed");
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

      <form
        onSubmit={submit}
        className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl w-96"
      >

        <h2 className="text-3xl font-bold mb-2">
          Create Account
        </h2>

        <p className="text-gray-600 mb-6">
          Register for Transport Dashboard
        </p>

        <input
          className="border border-gray-300 p-3 w-full mb-3 rounded-lg outline-none bg-white text-black placeholder-gray-500"
          placeholder="Name"
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value
            })
          }
        />

        <input
         className="border border-gray-300 p-3 w-full mb-3 rounded-lg outline-none bg-white text-black placeholder-gray-500"
          placeholder="Email"
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value
            })
          }
        />

        <input
          className="border border-gray-300 p-3 w-full mb-3 rounded-lg outline-none bg-white text-black placeholder-gray-500"
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value
            })
          }
        />

        <select
          className="border border-gray-300 p-3 w-full mb-3 rounded-lg outline-none bg-white text-black"
          value={form.role}
          onChange={(e) =>
            setForm({
              ...form,
              role: e.target.value
            })
          }
        >
          <option value="Admin" className="text-black">
            Admin
          </option>

          <option value="Driver" className="text-black">
            Driver
          </option>

          <option value="Manager" className="text-black">
            Manager
          </option>
        </select>

        <button
          className="bg-slate-900 hover:bg-black text-white p-3 rounded-xl w-full transition duration-300 shadow-lg hover:scale-[1.02]"
        >
          Register
        </button>

        <p className="mt-4 text-sm">
          Already have account?{" "}
          <Link
            className="text-blue-300"
            to="/login"
          >
            Login
          </Link>
        </p>

      </form>
    </div>
  );
}