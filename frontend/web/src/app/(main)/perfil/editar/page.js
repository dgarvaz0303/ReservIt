"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/components.css";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://TU-CODESPACE-8000.app.github.dev";

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

      const res = await fetch(`${API_URL}/api/usuarios/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data);
        return;
      }

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

      const res = await fetch(`${API_URL}/api/usuarios/me`, {
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

      // actualizar localStorage
      localStorage.setItem("nombre", form.nombre);

      router.push("/perfil");

    } catch (err) {
      console.log(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="page">Cargando...</p>;

  return (
    <div className="page">
      <div className="container">

        <div className="page-header">
          <h1 className="page-title">Editar perfil</h1>

          <button
            className="btn-secondary"
            onClick={() => router.back()}
          >
            ← Volver
          </button>
        </div>

        <div className="card perfil-card">

          <label>Nombre</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="input-filter"
          />

          <label>Nombre de usuario</label>
          <input
            name="nombre_user"
            value={form.nombre_user}
            onChange={handleChange}
            className="input-filter"
          />

          <label>Teléfono</label>
          <input
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            className="input-filter"
          />

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
  );
}