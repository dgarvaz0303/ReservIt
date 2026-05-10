"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import "@/styles/components.css";

export default function CrearEstablecimiento() {
  const router = useRouter();

  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    tipo: "",
    telefono: "",
  });

  const [imagen, setImagen] = useState(null);
  const [pdf, setPdf] = useState(null);

  const [zonas, setZonas] = useState([
    { nombre: "", capacidad: "" },
  ]);

  const [horarios, setHorarios] = useState([
    { dia_semana: 1, hora: "" },
  ]);

  const [sugerencias, setSugerencias] = useState([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // CAPACIDAD TOTAL
  // =========================

  const capacidadTotal = zonas.reduce(
    (acc, z) => acc + Number(z.capacidad || 0),
    0
  );

  // =========================
  // SUBIR ARCHIVOS
  // =========================

  const uploadFile = async (file, bucket) => {

    const fileExt = file.name.split(".").pop();

    const fileName = `${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.log("UPLOAD ERROR:", error);
      throw new Error(error.message);
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  // =========================
  // BUSCAR DIRECCIÓN
  // =========================

  const buscarDireccion = async (query) => {

    if (query.length < 3) return;

    try {

      const res = await fetch(
        `https://reservit.onrender.com/api/geo/buscar?q=${query}`
      );

      const json = await res.json();

      const lista = Array.isArray(json)
        ? json
        : json.data || [];

      const direcciones = lista.map((item) => ({
        display: item.display_name,
        calle:
          item.address?.road ||
          item.address?.pedestrian ||
          item.address?.residential ||
          "Dirección",
        lat: item.lat,
        lng: item.lon,
      }));

      setSugerencias(direcciones);

    } catch (err) {
      console.error("Error buscando dirección:", err);
    }
  };

  // =========================
  // ZONAS
  // =========================

  const addZona = () =>
    setZonas([
      ...zonas,
      { nombre: "", capacidad: "" },
    ]);

  const updateZona = (i, field, value) => {

    const updated = [...zonas];

    updated[i][field] = value;

    setZonas(updated);
  };

  const removeZona = (i) => {

    if (zonas.length === 1) return;

    setZonas(
      zonas.filter((_, index) => index !== i)
    );
  };

  // =========================
  // HORARIOS
  // =========================

  const addHorario = () =>
    setHorarios([
      ...horarios,
      { dia_semana: 1, hora: "" },
    ]);

  const updateHorario = (i, field, value) => {

    const updated = [...horarios];

    updated[i][field] = value;

    setHorarios(updated);
  };

  const removeHorario = (i) => {

    if (horarios.length === 1) return;

    setHorarios(
      horarios.filter((_, index) => index !== i)
    );
  };

  // =========================
  // CREAR
  // =========================

  const crear = async () => {

    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("No autenticado");
        return;
      }

      // =========================
      // VALIDAR CAMPOS
      // =========================

      const nombre = form.nombre.trim();
      const direccion = form.direccion.trim();
      const tipo = form.tipo.trim();
      const telefono = form.telefono.trim();

      if (
        !nombre ||
        !direccion ||
        !tipo ||
        !telefono
      ) {
        alert("Todos los campos son obligatorios");
        return;
      }

      // NOMBRE
      if (nombre.length < 3) {
        alert("El nombre es demasiado corto");
        return;
      }

      // TIPO
      if (tipo.length < 3) {
        alert("El tipo es demasiado corto");
        return;
      }

      // TELÉFONO
      if (!/^[0-9]{9,15}$/.test(telefono)) {
        alert("Teléfono inválido");
        return;
      }

      // DIRECCIÓN
      const direccionCompleta = direccion
        .toLowerCase()
        .includes("lebrija")
        ? direccion
        : `${direccion}, Lebrija`;

      // =========================
      // VALIDAR ZONAS
      // =========================

      if (zonas.length === 0) {
        alert("Debes añadir al menos una zona");
        return;
      }

      for (const z of zonas) {

        if (!z.nombre.trim()) {
          alert(
            "Todas las zonas deben tener nombre"
          );
          return;
        }

        if (!z.capacidad) {
          alert(
            "Todas las zonas deben tener capacidad"
          );
          return;
        }

        if (Number(z.capacidad) <= 0) {
          alert(
            "La capacidad debe ser mayor que 0"
          );
          return;
        }
      }

      // =========================
      // VALIDAR HORARIOS
      // =========================

      if (horarios.length === 0) {
        alert("Debes añadir horarios");
        return;
      }

      for (const h of horarios) {

        if (!h.hora) {
          alert(
            "Todos los horarios son obligatorios"
          );
          return;
        }
      }

      // =========================
      // VALIDAR IMAGEN
      // =========================

      if (!imagen) {
        alert(
          "La imagen principal es obligatoria"
        );
        return;
      }

      if (!imagen.type.startsWith("image/")) {
        alert("La imagen no es válida");
        return;
      }

      // =========================
      // VALIDAR PDF
      // =========================

      if (!pdf) {
        alert("La carta PDF es obligatoria");
        return;
      }

      if (pdf.type !== "application/pdf") {
        alert("La carta debe ser un PDF");
        return;
      }

      // =========================
      // SUBIR ARCHIVOS
      // =========================

      const imagen_url = await uploadFile(
        imagen,
        "establecimientos-img"
      );

      const carta_url = await uploadFile(
        pdf,
        "cartas-pdf"
      );

      // =========================
      // CREAR ESTABLECIMIENTO
      // =========================

      const res = await fetch(
        "https://reservit.onrender.com/api/establecimientos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nombre,
            direccion: direccionCompleta,
            tipo,
            telefono,
            imagen_url,
            carta_url,
            zonas,
            horarios,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Error al crear");
        return;
      }

      alert("Establecimiento creado correctamente");

      router.push("/establecimientos/mis");

    } catch (err) {

      console.error(err);

      alert("Error inesperado");

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="page">

      <div className="container">

        {/* HEADER */}
        <div className="page-header">

          <button
            className="btn-back"
            onClick={() =>
              router.push("/locales")
            }
          >
            ← Volver
          </button>

          <h1 className="page-title">
            Crear establecimiento
          </h1>

        </div>

        {/* CARD */}
        <div className="card">

          {/* CAMPOS */}
          <div className="filters">

            <label>Nombre</label>

            <input
              className="input-filter"
              value={form.nombre}
              maxLength={80}
              onChange={(e) =>
                setForm({
                  ...form,
                  nombre: e.target.value,
                })
              }
            />

            <label>Dirección</label>

            <input
              className="input-filter"
              value={form.direccion}
              onChange={(e) => {

                setForm({
                  ...form,
                  direccion: e.target.value,
                });

                buscarDireccion(e.target.value);
              }}
            />

            <p
              style={{
                fontSize: 12,
                color: "#888",
              }}
            >
              Ubicación dentro de Lebrija
            </p>

            {/* SUGERENCIAS */}
            {sugerencias.map((s, i) => (

              <div
                key={i}
                className="card"
                style={{
                  cursor: "pointer",
                  padding: 10,
                }}
                onClick={() => {

                  setForm({
                    ...form,
                    direccion: s.display,
                  });

                  setSugerencias([]);
                }}
              >
                {s.display}
              </div>
            ))}

            <label>Teléfono</label>

            <input
              className="input-filter"
              value={form.telefono}
              maxLength={15}
              onChange={(e) =>
                setForm({
                  ...form,
                  telefono: e.target.value.replace(
                    /\D/g,
                    ""
                  ),
                })
              }
            />

            <label>Tipo</label>

            <input
              className="input-filter"
              value={form.tipo}
              maxLength={40}
              onChange={(e) =>
                setForm({
                  ...form,
                  tipo: e.target.value,
                })
              }
            />

          </div>

          {/* CAPACIDAD */}
          <p style={{ marginTop: 10 }}>
            <strong>
              Capacidad total:
            </strong>{" "}
            {capacidadTotal}
          </p>

          {/* ZONAS */}
          <h2 className="page-subtitle">
            Zonas
          </h2>

          {zonas.map((z, i) => (

            <div className="filters" key={i}>

              <input
                className="input-filter"
                placeholder="Nombre zona"
                value={z.nombre}
                onChange={(e) =>
                  updateZona(
                    i,
                    "nombre",
                    e.target.value
                  )
                }
              />

              <input
                className="input-filter"
                type="number"
                placeholder="Capacidad"
                value={z.capacidad}
                onChange={(e) =>
                  updateZona(
                    i,
                    "capacidad",
                    e.target.value
                  )
                }
              />

              <button
                className="btn-danger"
                onClick={() => removeZona(i)}
              >
                ✕
              </button>

            </div>
          ))}

          <button
            className="btn-secondary"
            onClick={addZona}
          >
            + Añadir zona
          </button>

          {/* HORARIOS */}
          <h2 className="page-subtitle">
            Horarios
          </h2>

          {horarios.map((h, i) => (

            <div className="filters" key={i}>

              <select
                className="input-filter"
                value={h.dia_semana}
                onChange={(e) =>
                  updateHorario(
                    i,
                    "dia_semana",
                    Number(e.target.value)
                  )
                }
              >
                <option value={1}>Lunes</option>
                <option value={2}>Martes</option>
                <option value={3}>Miércoles</option>
                <option value={4}>Jueves</option>
                <option value={5}>Viernes</option>
                <option value={6}>Sábado</option>
                <option value={7}>Domingo</option>
              </select>

              <input
                type="time"
                className="input-filter"
                value={h.hora}
                onChange={(e) =>
                  updateHorario(
                    i,
                    "hora",
                    e.target.value
                  )
                }
              />

              <button
                className="btn-danger"
                onClick={() => removeHorario(i)}
              >
                ✕
              </button>

            </div>
          ))}

          <button
            className="btn-secondary"
            onClick={addHorario}
          >
            + Añadir horario
          </button>

          {/* IMAGEN */}
          <h2 className="page-subtitle">
            Imagen principal
          </h2>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImagen(e.target.files[0])
            }
          />

          {/* PDF */}
          <h2 className="page-subtitle">
            Carta (PDF)
          </h2>

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) =>
              setPdf(e.target.files[0])
            }
          />

          {/* BOTÓN */}
          <button
            className="btn-primary"
            style={{
              marginTop: 30,
              width: "100%",
            }}
            onClick={crear}
            disabled={loading}
          >
            {loading
              ? "Creando..."
              : "Crear establecimiento"}
          </button>

        </div>

      </div>

    </div>
  );
}