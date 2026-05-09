"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/editar-perfil.css";

export default function EditarPerfil() {
  const router = useRouter();

  const [form, setForm] = useState({
    nombre: "",
    nombre_user: "",
    telefono: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:8000/api/usuarios/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setForm({
        nombre: data.nombre || "",
        nombre_user: data.nombre_user || "",
        telefono: data.telefono || "",
      });

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // VALIDACIONES
  // =========================

  const validarTelefono = (telefono) => {
    return /^[0-9]{9}$/.test(telefono);
  };

  const validarUsuario = (usuario) => {
    return /^[a-zA-Z0-9_]+$/.test(usuario);
  };

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    // SOLO NÚMEROS EN TELÉFONO
    if (name === "telefono") {
      const limpio = value.replace(/\D/g, "");

      setForm({
        ...form,
        telefono: limpio,
      });

      return;
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  // =========================
  // GUARDAR
  // =========================

  const guardar = async () => {

    setError("");
    setSuccess("");

    const nombre = form.nombre.trim();
    const nombre_user = form.nombre_user.trim();
    const telefono = form.telefono.trim();

    // CAMPOS VACÍOS
    if (!nombre || !nombre_user || !telefono) {
      setError("Todos los campos son obligatorios");
      return;
    }

    // NOMBRE
    if (nombre.length < 3) {
      setError("El nombre debe tener al menos 3 caracteres");
      return;
    }

    // USER
    if (nombre_user.length < 3) {
      setError("El usuario es demasiado corto");
      return;
    }

    if (!validarUsuario(nombre_user)) {
      setError(
        "El usuario solo puede contener letras, números y _"
      );
      return;
    }

    // TELÉFONO
    if (!validarTelefono(telefono)) {
      setError("El teléfono debe tener 9 números");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:8000/api/usuarios/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre,
          nombre_user,
          telefono,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Error al guardar");
        return;
      }

      setSuccess("Perfil actualizado correctamente");

      setTimeout(() => {
        router.push("/perfil");
      }, 1200);

    } catch (err) {
      console.log(err);
      setError("Error de conexión");

    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="editar-loading">Cargando...</p>;
  }

  return (
    <div className="editar-page">
      <div className="editar-container">

        {/* HEADER */}
        <div className="editar-header">

          <button
            className="btn-back"
            onClick={() => router.push("/perfil")}
          >
            ← Volver a perfil
          </button>

          <div>
            <h1 className="editar-title">
              Editar perfil
            </h1>

            <p className="editar-subtitle">
              Actualiza tu información personal
            </p>
          </div>

        </div>

        {/* FORM */}
        <div className="editar-card">

          <div className="form-grid">

            {/* NOMBRE */}
            <div className="form-group">
              <label>Nombre</label>

              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                maxLength={60}
              />
            </div>

            {/* USER */}
            <div className="form-group">
              <label>Usuario</label>

              <input
                name="nombre_user"
                value={form.nombre_user}
                onChange={handleChange}
                maxLength={30}
              />
            </div>

            {/* TELÉFONO */}
            <div className="form-group full">
              <label>Teléfono</label>

              <input
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                maxLength={9}
              />
            </div>

          </div>

          {/* MENSAJES */}
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

          {/* BOTONES */}
          <div className="editar-actions">

            <button
              className="btn-secondary"
              onClick={() => router.push("/perfil")}
            >
              Cancelar
            </button>

            <button
              className="btn-primary"
              onClick={guardar}
              disabled={saving}
              style={{
                opacity: saving ? 0.7 : 1,
                cursor: saving
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {saving
                ? "Guardando..."
                : "Guardar cambios"}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}