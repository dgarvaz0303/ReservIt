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

      <div className="register-wrapper">

        {/* FORM */}
        <div className="register-card">

          <button
            className="back-button"
            onClick={() => router.push("/login")}
          >
            ← Volver al login
          </button>

          <h1 className="login-title">Crear cuenta</h1>

          <p className="login-subtitle">
            Regístrate para empezar a reservar
          </p>

          <form onSubmit={handleSubmit} className="register-form">

            <input
              className="login-input"
              name="nombre"
              placeholder="Nombre completo"
              value={form.nombre}
              onChange={handleChange}
            />

            <input
              className="login-input"
              name="nombre_user"
              placeholder="Nombre de usuario"
              value={form.nombre_user}
              onChange={handleChange}
            />

            <input
              className="login-input full"
              name="email"
              type="email"
              placeholder="Correo electrónico"
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
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
            />

            <button type="submit" className="login-button full">
              Crear cuenta
            </button>
          </form>

          {error && <p className="login-error">{error}</p>}
          {success && <p className="register-success">{success}</p>}
        </div>

        {/* LOGO DERECHA */}
        <div className="register-logo">
          <img src="https://hncbzycaenboslmsgutc.supabase.co/storage/v1/object/public/establecimientos-img/logoclaro.png" alt="Logo" />
        </div>

      </div>
    </div>
  );
}