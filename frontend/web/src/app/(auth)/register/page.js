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
  const [loading, setLoading] = useState(false);

  // =========================
  // VALIDACIONES
  // =========================

  const validarEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validarTelefono = (telefono) => {
    return /^[0-9]{9}$/.test(telefono);
  };

  const validarNombreUsuario = (nombre) => {
    return /^[a-zA-Z0-9_]+$/.test(nombre);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const nombre = form.nombre.trim();
    const nombre_user = form.nombre_user.trim();
    const email = form.email.trim();
    const telefono = form.telefono.trim();
    const password = form.password.trim();

    // CAMPOS VACIOS
    if (
      !nombre ||
      !nombre_user ||
      !email ||
      !telefono ||
      !password
    ) {
      setError("Todos los campos son obligatorios");
      return;
    }

    // NOMBRE
    if (nombre.length < 3) {
      setError(
        "El nombre debe tener al menos 3 caracteres"
      );
      return;
    }

    // USERNAME
    if (nombre_user.length < 3) {
      setError(
        "El nombre de usuario es demasiado corto"
      );
      return;
    }

    if (!validarNombreUsuario(nombre_user)) {
      setError(
        "El usuario solo puede contener letras, números y _"
      );
      return;
    }

    // EMAIL
    if (!validarEmail(email)) {
      setError("Introduce un correo válido");
      return;
    }

    // TELEFONO
    if (!validarTelefono(telefono)) {
      setError(
        "El teléfono debe tener 9 números"
      );
      return;
    }

    // PASSWORD
    if (password.length < 6) {
      setError(
        "La contraseña debe tener al menos 6 caracteres"
      );
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "https://reservit.onrender.com/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre,
            nombre_user,
            email,
            telefono,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.detail || "Error en registro"
        );
      }

      setSuccess(
        "Usuario registrado correctamente"
      );

      setForm({
        nombre: "",
        nombre_user: "",
        email: "",
        telefono: "",
        password: "",
      });

      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (err) {
      setError(
        err.message || "Error al registrarse"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      <div className="register-wrapper">

        {/* FORM */}
        <div className="register-card">

          <button
            className="back-button"
            onClick={() =>
              router.push("/login")
            }
          >
            ← Volver al login
          </button>

          <h1 className="login-title">
            Crear cuenta
          </h1>

          <p className="login-subtitle">
            Regístrate para empezar a reservar
          </p>

          <form
            onSubmit={handleSubmit}
            className="register-form"
          >

            {/* NOMBRE */}
            <input
              className="login-input"
              name="nombre"
              placeholder="Nombre completo"
              value={form.nombre}
              maxLength={60}
              onChange={handleChange}
            />

            {/* USERNAME */}
            <input
              className="login-input"
              name="nombre_user"
              placeholder="Nombre de usuario"
              value={form.nombre_user}
              maxLength={30}
              onChange={handleChange}
            />

            {/* EMAIL */}
            <input
              className="login-input full"
              name="email"
              type="email"
              placeholder="Correo electrónico"
              value={form.email}
              maxLength={100}
              onChange={handleChange}
            />

            {/* TELEFONO */}
            <input
              className="login-input"
              name="telefono"
              placeholder="Teléfono"
              value={form.telefono}
              maxLength={9}
              onChange={(e) => {
                // SOLO NUMEROS
                const value =
                  e.target.value.replace(/\D/g, "");

                setForm({
                  ...form,
                  telefono: value,
                });
              }}
            />

            {/* PASSWORD */}
            <input
              className="login-input"
              name="password"
              type="password"
              placeholder="Contraseña"
              value={form.password}
              maxLength={50}
              onChange={handleChange}
            />

            {/* BOTON */}
            <button
              type="submit"
              className="login-button full"
              disabled={loading}
              style={{
                opacity: loading ? 0.7 : 1,
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {loading
                ? "Creando cuenta..."
                : "Crear cuenta"}
            </button>

          </form>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          {success && (
            <p className="register-success">
              {success}
            </p>
          )}

        </div>

        {/* LOGO */}
        <div className="register-logo">
          <img
            src="https://hncbzycaenboslmsgutc.supabase.co/storage/v1/object/public/establecimientos-img/logoclaro.png"
            alt="Logo"
          />
        </div>

      </div>
    </div>
  );
}