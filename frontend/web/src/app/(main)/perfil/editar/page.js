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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const guardar = async () => {
    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:8000/api/usuarios/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Error al guardar");
        return;
      }

      alert("Perfil actualizado correctamente");

      router.push("/perfil");

    } catch (err) {
      console.log(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="editar-loading">Cargando...</p>;

  return (
    <div className="editar-page">
      <div className="editar-container">

        {/* HEADER */}
        <div className="editar-header">

          {/* BOTÓN NUEVO */}
          <button
            className="btn-back"
            onClick={() => router.push("/perfil")}
          >
            ← Volver a perfil
          </button>

          <div>
            <h1 className="editar-title">Editar perfil</h1>
            <p className="editar-subtitle">
              Actualiza tu información personal
            </p>
          </div>

        </div>

        {/* FORM */}
        <div className="editar-card">

          <div className="form-grid">

            <div className="form-group">
              <label>Nombre</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Usuario</label>
              <input
                name="nombre_user"
                value={form.nombre_user}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full">
              <label>Teléfono</label>
              <input
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
              />
            </div>

          </div>

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
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}