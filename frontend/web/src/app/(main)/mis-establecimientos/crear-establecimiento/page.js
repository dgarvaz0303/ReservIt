"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/components.css";

export default function CrearEstablecimiento() {
  const router = useRouter();

  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    capacidad: "",
    tipo: "",
  });

  const [imagen, setImagen] = useState(null);
  const [pdf, setPdf] = useState(null);

  const uploadFile = async (file, bucket) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      `https://TU_PROJECT_ID.supabase.co/storage/v1/object/${bucket}/${fileName}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer TU_SUPABASE_KEY`,
        },
        body: formData,
      }
    );

    if (!res.ok) throw new Error("Error subiendo archivo");

    return `https://TU_PROJECT_ID.supabase.co/storage/v1/object/public/${bucket}/${fileName}`;
  };

  const crear = async () => {
    try {
      const auth_id = localStorage.getItem("user_id");

      let imagen_url = null;
      let carta_url = null;

      if (imagen) imagen_url = await uploadFile(imagen, "imagenes");
      if (pdf) carta_url = await uploadFile(pdf, "cartas");

      const res = await fetch(
        "http://localhost:8000/api/establecimientos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            capacidad: Number(form.capacidad),
            imagen_url,
            carta_url,
            auth_id,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail);
        return;
      }

      alert("Establecimiento creado");
      router.push("/establecimientos/mis");

    } catch (err) {
      console.log(err);
      alert("Error");
    }
  };

  return (
    <div className="page">
      <div className="container">

        {/* HEADER */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Crear establecimiento</h1>
            <p className="page-subtitle">
              Añade un nuevo local a tu cuenta
            </p>
          </div>

          <button
            className="btn-secondary"
            onClick={() => router.back()}
          >
            ← Volver
          </button>
        </div>

        {/* FORM */}
        <div className="card">

          <div className="filters">

            <input
              className="input-filter"
              placeholder="Nombre"
              value={form.nombre}
              onChange={(e) =>
                setForm({ ...form, nombre: e.target.value })
              }
            />

            <input
              className="input-filter"
              placeholder="Dirección"
              value={form.direccion}
              onChange={(e) =>
                setForm({ ...form, direccion: e.target.value })
              }
            />

            <input
              className="input-filter"
              placeholder="Capacidad"
              value={form.capacidad}
              onChange={(e) =>
                setForm({ ...form, capacidad: e.target.value })
              }
            />

            <input
              className="input-filter"
              placeholder="Tipo (Restaurante, Bar...)"
              value={form.tipo}
              onChange={(e) =>
                setForm({ ...form, tipo: e.target.value })
              }
            />

          </div>

          {/* IMAGEN */}
          <div style={{ marginTop: 20 }}>
            <label className="est-info">Imagen</label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImagen(e.target.files[0])}
            />

            {imagen && (
              <img
                src={URL.createObjectURL(imagen)}
                alt="preview"
                style={{
                  marginTop: 10,
                  width: "100%",
                  height: 180,
                  objectFit: "cover",
                  borderRadius: 12,
                }}
              />
            )}
          </div>

          {/* PDF */}
          <div style={{ marginTop: 20 }}>
            <label className="est-info">Carta (PDF)</label>

            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdf(e.target.files[0])}
            />

            {pdf && (
              <p className="est-info" style={{ marginTop: 8 }}>
                {pdf.name}
              </p>
            )}
          </div>

          {/* BOTÓN */}
          <button
            className="btn-primary"
            style={{ marginTop: 25, width: "100%" }}
            onClick={crear}
          >
            Crear establecimiento
          </button>

        </div>

      </div>
    </div>
  );
}