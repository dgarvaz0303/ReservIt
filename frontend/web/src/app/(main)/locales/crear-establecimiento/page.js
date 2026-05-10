"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import "@/styles/components.css";

const DIAS_SEMANA = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
  { value: 7, label: "Domingo" },
];

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

  const capacidadTotal = zonas.reduce(
    (acc, z) => acc + Number(z.capacidad || 0),
    0
  );

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

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);

    return data.publicUrl;
  };

  const buscarDireccion = async (query) => {
    if (query.length < 3) return;

    try {
      const res = await fetch(
        `https://reservit.onrender.com/api/geo/buscar?q=${query}`
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

  const addHorario = () =>
    setHorarios([...horarios, { dia_semana: 1, hora: "" }]);

  const updateHorario = (i, field, value) => {
    const updated = [...horarios];
    updated[i][field] = value;
    setHorarios(updated);
  };

  const removeHorario = (i) => {
    if (horarios.length === 1) return;
    setHorarios(horarios.filter((_, index) => index !== i));
  };

  const crear = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("No autenticado");
        return;
      }

      const nombre = form.nombre.trim();
      const direccion = form.direccion.trim();
      const tipo = form.tipo.trim();
      const telefono = form.telefono.trim();

      if (!nombre || !direccion || !tipo || !telefono) {
        alert("Todos los campos son obligatorios");
        return;
      }

      if (nombre.length < 3) {
        alert("El nombre es demasiado corto");
        return;
      }

      if (tipo.length < 3) {
        alert("El tipo es demasiado corto");
        return;
      }

      if (!/^[0-9]{9,15}$/.test(telefono)) {
        alert("Teléfono inválido");
        return;
      }

      const direccionCompleta = direccion.toLowerCase().includes("lebrija")
        ? direccion
        : `${direccion}, Lebrija`;

      if (zonas.length === 0) {
        alert("Debes añadir al menos una zona");
        return;
      }

      for (const z of zonas) {
        if (!z.nombre.trim()) {
          alert("Todas las zonas deben tener nombre");
          return;
        }

        if (!z.capacidad) {
          alert("Todas las zonas deben tener capacidad");
          return;
        }

        if (Number(z.capacidad) <= 0) {
          alert("La capacidad debe ser mayor que 0");
          return;
        }
      }

      if (horarios.length === 0) {
        alert("Debes añadir horarios");
        return;
      }

      for (const h of horarios) {
        if (!h.hora) {
          alert("Todos los horarios son obligatorios");
          return;
        }
      }

      if (!imagen) {
        alert("La imagen principal es obligatoria");
        return;
      }

      if (!imagen.type.startsWith("image/")) {
        alert("La imagen no es válida");
        return;
      }

      if (!pdf) {
        alert("La carta PDF es obligatoria");
        return;
      }

      if (pdf.type !== "application/pdf") {
        alert("La carta debe ser un PDF");
        return;
      }

      const imagen_url = await uploadFile(imagen, "establecimientos-img");
      const carta_url = await uploadFile(pdf, "cartas-pdf");

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

  return (
    <div className="page">
      <div className="container">
        <div className="page-header create-local-header">
          <div>
            <h1 className="page-title">Crear establecimiento</h1>
            <p className="page-subtitle">
              Registra los datos del local, sus zonas, horarios e imagen pública.
            </p>
          </div>

          <button className="btn-secondary" onClick={() => router.push("/locales")}>
            Volver
          </button>
        </div>

        <div className="create-local-layout">
          <aside className="create-local-summary">
            <span>Resumen</span>
            <h2>{form.nombre || "Nuevo establecimiento"}</h2>
            <div>
              <p>Zonas configuradas</p>
              <strong>{zonas.length}</strong>
            </div>
            <div>
              <p>Capacidad total</p>
              <strong>{capacidadTotal}</strong>
            </div>
            <div>
              <p>Horarios</p>
              <strong>{horarios.length}</strong>
            </div>
          </aside>

          <div className="create-local-form">
            <section className="create-local-section">
              <div className="create-local-section-title">
                <h2>Datos del establecimiento</h2>
                <p>Información principal que verán los usuarios.</p>
              </div>

              <div className="create-local-grid">
                <label className="create-local-field">
                  <span>Nombre</span>
                  <input
                    className="input-filter"
                    value={form.nombre}
                    maxLength={80}
                    onChange={(e) =>
                      setForm({ ...form, nombre: e.target.value })
                    }
                  />
                </label>

                <label className="create-local-field">
                  <span>Tipo</span>
                  <input
                    className="input-filter"
                    value={form.tipo}
                    maxLength={40}
                    onChange={(e) =>
                      setForm({ ...form, tipo: e.target.value })
                    }
                  />
                </label>

                <label className="create-local-field create-local-field-wide">
                  <span>Dirección</span>
                  <input
                    className="input-filter"
                    value={form.direccion}
                    onChange={(e) => {
                      setForm({ ...form, direccion: e.target.value });
                      buscarDireccion(e.target.value);
                    }}
                  />
                  <small>Ubicación dentro de Lebrija.</small>
                </label>

                {sugerencias.length > 0 && (
                  <div className="create-local-suggestions">
                    {sugerencias.map((s, i) => (
                      <button
                        type="button"
                        key={`${s.display}-${i}`}
                        onClick={() => {
                          setForm({ ...form, direccion: s.display });
                          setSugerencias([]);
                        }}
                      >
                        {s.display}
                      </button>
                    ))}
                  </div>
                )}

                <label className="create-local-field">
                  <span>Teléfono</span>
                  <input
                    className="input-filter"
                    value={form.telefono}
                    maxLength={15}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        telefono: e.target.value.replace(/\D/g, ""),
                      })
                    }
                  />
                </label>
              </div>
            </section>

            <section className="create-local-section">
              <div className="create-local-section-title">
                <h2>Zonas</h2>
                <p>Define los espacios del local y la capacidad de cada uno.</p>
              </div>

              <div className="create-local-rows">
                {zonas.map((z, i) => (
                  <div className="create-local-row" key={i}>
                    <input
                      className="input-filter"
                      placeholder="Nombre de zona"
                      value={z.nombre}
                      onChange={(e) => updateZona(i, "nombre", e.target.value)}
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

                    <button className="btn-danger" onClick={() => removeZona(i)}>
                      Quitar
                    </button>
                  </div>
                ))}
              </div>

              <button className="btn-secondary" onClick={addZona}>
                Añadir zona
              </button>
            </section>

            <section className="create-local-section">
              <div className="create-local-section-title">
                <h2>Horarios</h2>
                <p>Añade los días y horas disponibles para reservas.</p>
              </div>

              <div className="create-local-rows">
                {horarios.map((h, i) => (
                  <div className="create-local-row" key={i}>
                    <select
                      className="input-filter"
                      value={h.dia_semana}
                      onChange={(e) =>
                        updateHorario(i, "dia_semana", Number(e.target.value))
                      }
                    >
                      {DIAS_SEMANA.map((dia) => (
                        <option key={dia.value} value={dia.value}>
                          {dia.label}
                        </option>
                      ))}
                    </select>

                    <input
                      type="time"
                      className="input-filter"
                      value={h.hora}
                      onChange={(e) => updateHorario(i, "hora", e.target.value)}
                    />

                    <button
                      className="btn-danger"
                      onClick={() => removeHorario(i)}
                    >
                      Quitar
                    </button>
                  </div>
                ))}
              </div>

              <button className="btn-secondary" onClick={addHorario}>
                Añadir horario
              </button>
            </section>

            <section className="create-local-section">
              <div className="create-local-section-title">
                <h2>Archivos</h2>
                <p>Sube la imagen principal y la carta del establecimiento.</p>
              </div>

              <div className="create-local-files">
                <label>
                  <span>Imagen principal</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImagen(e.target.files[0])}
                  />
                  <small>{imagen ? imagen.name : "Archivo obligatorio"}</small>
                </label>

                <label>
                  <span>Carta PDF</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setPdf(e.target.files[0])}
                  />
                  <small>{pdf ? pdf.name : "Archivo obligatorio"}</small>
                </label>
              </div>
            </section>

            <button
              className="btn-primary create-local-submit"
              onClick={crear}
              disabled={loading}
            >
              {loading ? "Creando..." : "Crear establecimiento"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
