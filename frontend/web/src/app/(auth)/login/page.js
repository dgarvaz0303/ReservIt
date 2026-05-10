"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/login.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // VALIDAR EMAIL
  const validarEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // LIMPIAR ESPACIOS
    const emailLimpio = email.trim();
    const passwordLimpia = password.trim();

    // =========================
    // VALIDACIONES
    // =========================

    if (!emailLimpio || !passwordLimpia) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (!validarEmail(emailLimpio)) {
      setError("Introduce un correo válido");
      return;
    }

    if (passwordLimpia.length < 6) {
      setError(
        "La contraseña debe tener al menos 6 caracteres"
      );
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "https://reservit.onrender.com/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailLimpio,
            password: passwordLimpia,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.detail || "Error en login"
        );
      }

      if (!data.access_token || !data.rol) {
        throw new Error(
          "Respuesta de login incompleta"
        );
      }

      localStorage.setItem(
        "token",
        data.access_token
      );

      localStorage.setItem(
        "nombre",
        data.nombre || emailLimpio
      );

      localStorage.setItem(
        "rol",
        data.rol
      );

      router.replace("/");

    } catch (err) {
      setError(
        err.message || "Error al iniciar sesión"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      {/* LOGO */}
      <div className="login-logo">
        <img
          src="https://hncbzycaenboslmsgutc.supabase.co/storage/v1/object/public/establecimientos-img/logoclaro.png"
          alt="Logo"
        />
      </div>

      <div className="login-card">

        <h1 className="login-title">
          Bienvenido
        </h1>

        <p className="login-subtitle">
          Accede a tu cuenta para continuar
        </p>

        <form
          onSubmit={handleSubmit}
          className="login-form"
        >

          {/* EMAIL */}
          <input
            className="login-input"
            type="email"
            placeholder="Correo electrónico"
            value={email}
            maxLength={100}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          {/* PASSWORD */}
          <input
            className="login-input"
            type="password"
            placeholder="Contraseña"
            value={password}
            maxLength={50}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          {/* BOTON */}
          <button
            type="submit"
            className="login-button"
            disabled={loading}
            style={{
              opacity: loading ? 0.7 : 1,
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading
              ? "Iniciando sesión..."
              : "Iniciar sesión"}
          </button>

        </form>

        <button
          className="login-secondary"
          onClick={() =>
            router.push("/register")
          }
        >
          ¿No tienes cuenta? Regístrate
        </button>

        {error && (
          <p className="login-error">
            {error}
          </p>
        )}

      </div>
    </div>
  );
}