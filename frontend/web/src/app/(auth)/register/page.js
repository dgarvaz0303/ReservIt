"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/login.css";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    nombre: "",
    nombre_user: "",
    email: "",
    telefono: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Error en registro");
      }

      setSuccess("Usuario registrado correctamente");

      setForm({
        nombre: "",
        nombre_user: "",
        email: "",
        telefono: "",
        password: "",
      });

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card register-card">

        {/* BOTÓN VOLVER */}
        <button
          className="back-button"
          onClick={() => router.push("/login")}
        >
          ← Volver al login
        </button>

        <h1 className="login-title">Crear cuenta</h1>

        <form onSubmit={handleSubmit} className="register-form">
          
          <input
            className="login-input"
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
          />

          <input
            className="login-input"
            name="nombre_user"
            placeholder="Usuario"
            value={form.nombre_user}
            onChange={handleChange}
          />

          <input
            className="login-input full"
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            className="login-input"
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={handleChange}
          />

          <input
            className="login-input"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          <button type="submit" className="login-button full">
            Registrarse
          </button>
        </form>

        {error && <p className="login-error">{error}</p>}
        {success && <p className="register-success">{success}</p>}
      </div>
    </div>
  );
}