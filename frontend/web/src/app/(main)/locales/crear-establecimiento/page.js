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

  const [zonas, setZonas] = useState([{ nombre: "", capacidad: "" }]);
  const [horarios, setHorarios] = useState([{ dia_semana: 1, hora: "" }]);

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
  // BUSCADOR DIRECCIÓN (BACKEND)
  // =========================
  const buscarDireccion = async (query) => {
    if (query.length < 3) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/geo/buscar?q=${query}`
      );

      const json = await res.json();

      const lista = Array.isArray(json) ? json : json.data || [];

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
    setZonas([...zonas, { nombre: "", capacidad: "" }]);

  const updateZona = (i, field, value) => {
    const updated = [...zonas];
    updated[i][field] = value;
    setZonas(updated);
  };

  const removeZona = (i) => {
    if (zonas.length === 1) return;
    setZonas(zonas.filter((_, index) => index !== i));
  };

  // =========================
  // HORARIOS
  // =========================
  const addHorario = () =>
    setHorarios([...horarios, { dia_semana: 1, hora: "" }]);

  const updateHorario = (i, field, value) => {
    const updated = [...horarios];
    updated[i][field] = value;
    setHorarios(updated);
  };

  const removeHorario = (i) =>
    setHorarios(horarios.filter((_, index) => index !== i));

  // =========================
  // CREAR ESTABLECIMIENTO
  // =========================
  const crear = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) return alert("No autenticado");

      // VALIDAR DIRECCIÓN
      const direccionLimpia = form.direccion.trim();

      if (!direccionLimpia) {
        return alert("La dirección es obligatoria");
      }

      const direccionCompleta = direccionLimpia
        .toLowerCase()
        .includes("lebrija")
        ? direccionLimpia
        : `${direccionLimpia}, Lebrija`;

      // VALIDAR TELÉFONO
      if (!/^[0-9]{9,15}$/.test(form.telefono)) {
        return alert("Teléfono inválido");
      }

      // VALIDAR ZONAS
      if (
        zonas.some(
          (z) => !z.nombre.trim() || Number(z.capacidad) <= 0
        )
      ) {
        return alert("Zonas inválidas");
      }

      let imagen_url = null;
      let carta_url = null;

      // IMAGEN
      if (imagen) {
        if (!imagen.type.startsWith("image/")) {
          return alert("La imagen no es válida");
        }

        imagen_url = await uploadFile(
          imagen,
          "establecimientos-img"
        );
      }

      // PDF
      if (pdf) {
        if (pdf.type !== "application/pdf") {
          return alert("La carta debe ser un PDF");
        }

        carta_url = await uploadFile(pdf, "cartas-pdf");
      }

      const res = await fetch(
        "http://localhost:8000/api/establecimientos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...form,
            direccion: direccionCompleta,
            imagen_url,
            carta_url,
            zonas,
            horarios,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail);
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

        <div className="page-header">
          <h1 className="page-title">Crear establecimiento</h1>
        </div>

        <div className="card">

          <div className="filters">

            <label>Nombre</label>
            <input
              className="input-filter"
              value={form.nombre}
              onChange={(e) =>
                setForm({ ...form, nombre: e.target.value })
              }
            />

            <label>Dirección</label>
            <input
              className="input-filter"
              value={form.direccion}
              onChange={(e) => {
                setForm({ ...form, direccion: e.target.value });
                buscarDireccion(e.target.value);
              }}
            />

            <p style={{ fontSize: 12, color: "#888" }}>
              Ubicación dentro de Lebrija
            </p>

            {sugerencias.map((s, i) => (
              <div
                key={i}
                className="card"
                style={{ cursor: "pointer", padding: 10 }}
                onClick={() => {
                  setForm({ ...form, direccion: s.display });
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
              onChange={(e) =>
                setForm({ ...form, telefono: e.target.value })
              }
            />

            <label>Tipo</label>
            <input
              className="input-filter"
              value={form.tipo}
              onChange={(e) =>
                setForm({ ...form, tipo: e.target.value })
              }
            />

          </div>

          <p style={{ marginTop: 10 }}>
            <strong>Capacidad total:</strong> {capacidadTotal}
          </p>

          <h2 className="page-subtitle">Zonas</h2>

          {zonas.map((z, i) => (
            <div className="filters" key={i}>
              <input
                className="input-filter"
                placeholder="Nombre zona"
                value={z.nombre}
                onChange={(e) =>
                  updateZona(i, "nombre", e.target.value)
                }
              />

              <input
                className="input-filter"
                type="number"
                placeholder="Capacidad"
                value={z.capacidad}
                onChange={(e) =>
                  updateZona(i, "capacidad", e.target.value)
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

          <button className="btn-secondary" onClick={addZona}>
            + Añadir zona
          </button>

          <h2 className="page-subtitle">Horarios</h2>

          {horarios.map((h, i) => (
            <div className="filters" key={i}>
              <select
                className="input-filter"
                value={h.dia_semana}
                onChange={(e) =>
                  updateHorario(i, "dia_semana", Number(e.target.value))
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
                  updateHorario(i, "hora", e.target.value)
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

          <button className="btn-secondary" onClick={addHorario}>
            + Añadir horario
          </button>

          <h2 className="page-subtitle">Imagen principal</h2>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files[0])}
          />

          <h2 className="page-subtitle">Carta (PDF)</h2>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdf(e.target.files[0])}
          />

          <button
            className="btn-primary"
            style={{ marginTop: 30, width: "100%" }}
            onClick={crear}
            disabled={loading}
          >
            {loading ? "Creando..." : "Crear establecimiento"}
          </button>

        </div>
      </div>
    </div>
  );
}