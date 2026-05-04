"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/login.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Error en login");
      }

      if (!data.access_token || !data.rol) {
        throw new Error("Respuesta de login incompleta");
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("nombre", data.nombre || email);
      localStorage.setItem("rol", data.rol);

      router.replace("/");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">

      {/* LOGO */}
      <div className="login-logo">
        <img src="https://hncbzycaenboslmsgutc.supabase.co/storage/v1/object/public/establecimientos-img/logoclaro.png" alt="Logo" />
      </div>

      <div className="login-card">
        <h1 className="login-title">Bienvenido</h1>

        <p className="login-subtitle">
          Accede a tu cuenta para continuar
        </p>

        <form onSubmit={handleSubmit} className="login-form">

          <input
            className="login-input"
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="login-input"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="login-button">
            Iniciar sesión
          </button>
        </form>

        <button
          className="login-secondary"
          onClick={() => router.push("/register")}
        >
          ¿No tienes cuenta? Regístrate
        </button>

        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  );
}