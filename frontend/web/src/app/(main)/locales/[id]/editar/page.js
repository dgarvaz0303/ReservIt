"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import "@/styles/components.css";

export default function EditarEstablecimiento() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    tipo: "",
    telefono: "",
  });

  const [original, setOriginal] = useState(null);

  const [zonas, setZonas] = useState([]);
  const [horarios, setHorarios] = useState([]);

  const [imagen, setImagen] = useState(null);
  const [pdf, setPdf] = useState(null);

  const [imagenActual, setImagenActual] = useState(null);

  const [loading, setLoading] = useState(false);

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await fetch(
      `http://localhost:8000/api/establecimientos/${id}`
    );
    const data = await res.json();

    const est = data.data || data;

    const base = {
      nombre: est.nombre,
      direccion: est.direccion,
      tipo: est.tipo,
      telefono: est.telefono,
    };

    setForm(base);

    // GUARDAR TODO
    setOriginal({
      ...base,
      zonas: est.zonas || [],
      horarios: est.horarios || [],
    });

    setZonas(est.zonas || []);
    setHorarios(est.horarios || []);
    setImagenActual(est.imagen_url);
  };

  // =========================
  // DETECTAR CAMBIOS
  // =========================
  const hayCambios = () => {
    if (!original) return false;

    return (
      Object.keys(form).some((key) => form[key] !== original[key]) ||
      JSON.stringify(zonas) !== JSON.stringify(original.zonas) ||
      JSON.stringify(horarios) !== JSON.stringify(original.horarios) ||
      imagen ||
      pdf
    );
  };

  const getCambios = () => {
    const cambios = {};

    Object.keys(form).forEach((key) => {
      if (form[key] !== original[key]) {
        cambios[key] = form[key];
      }
    });

    return cambios;
  };

  // =========================
  // SUBIR ARCHIVO
  // =========================
  const uploadFile = async (file, bucket) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  // =========================
  // GUARDAR
  // =========================
  const guardar = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      let cambios = getCambios();

      // AVISO SI ELIMINAS ZONAS
      const zonasEliminadas = original?.zonas?.filter(
        (z) => !zonas.some((nz) => nz.id === z.id)
      );

      if (zonasEliminadas?.length > 0) {
        const confirmar = confirm(
          "Has eliminado zonas.\nSe eliminarán también sus reservas.\n\n¿Continuar?"
        );

        if (!confirmar) {
          setLoading(false);
          return;
        }
      }

      // =========================
      // IMAGEN / PDF
      // =========================
      if (imagen) {
        cambios.imagen_url = await uploadFile(
          imagen,
          "establecimientos-img"
        );
      }

      if (pdf) {
        cambios.carta_url = await uploadFile(
          pdf,
          "cartas-pdf"
        );
      }

      // =========================
      // ZONAS SOLO SI CAMBIAN
      // =========================
      if (
        JSON.stringify(zonas) !== JSON.stringify(original.zonas)
      ) {
        cambios.zonas = zonas;
      }

      // =========================
      // HORARIOS SOLO SI CAMBIAN
      // =========================
      if (
        JSON.stringify(horarios) !== JSON.stringify(original.horarios)
      ) {
        cambios.horarios = horarios;
      }

      await fetch(
        `http://localhost:8000/api/establecimientos/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cambios),
        }
      );

      alert("Actualizado correctamente");
      router.back();

    } catch (err) {
      console.error(err);
      alert("Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // VOLVER CON CONFIRMACIÓN
  // =========================
  const volver = () => {
    if (hayCambios()) {
      const confirmar = confirm(
        "Tienes cambios sin guardar.\n\n¿Salir sin guardar?"
      );

      if (!confirmar) return;
    }

    router.back();
  };

  if (!original) return <p className="page">Cargando...</p>;

  return (
    <div className="page">
      <div className="container">

        {/* HEADER */}
        <div className="page-header">
          <h1 className="page-title">Editar establecimiento</h1>

          <button className="btn-secondary" onClick={volver}>
            ← Volver
          </button>
        </div>

        <div className="card">

          {/* FORM */}
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
              onChange={(e) =>
                setForm({ ...form, direccion: e.target.value })
              }
            />

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

          {/* IMAGEN */}
          <h2 className="page-subtitle">Imagen actual</h2>

          {imagenActual && (
            <img
              src={imagenActual}
              style={{
                width: "100%",
                maxWidth: 300,
                borderRadius: 10,
              }}
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files[0])}
          />

          {imagen && (
            <img
              src={URL.createObjectURL(imagen)}
              style={{
                width: "100%",
                maxWidth: 300,
                marginTop: 10,
                borderRadius: 10,
              }}
            />
          )}

          {/* PDF */}
          <h2 className="page-subtitle">Carta (PDF)</h2>

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdf(e.target.files[0])}
          />

          {/* ZONAS */}
          <h2 className="page-subtitle">Zonas</h2>

          {zonas.map((z, i) => (
            <div className="filters" key={i}>
              <input
                className="input-filter"
                value={z.nombre}
                onChange={(e) => {
                  const copy = [...zonas];
                  copy[i].nombre = e.target.value;
                  setZonas(copy);
                }}
              />

              <input
                type="number"
                className="input-filter"
                value={z.capacidad}
                onChange={(e) => {
                  const copy = [...zonas];
                  copy[i].capacidad = e.target.value;
                  setZonas(copy);
                }}
              />

              <button
                className="btn-danger"
                onClick={() =>
                  setZonas(zonas.filter((_, idx) => idx !== i))
                }
              >
                ✕
              </button>
            </div>
          ))}

          <button
            className="btn-secondary"
            onClick={() =>
              setZonas([...zonas, { nombre: "", capacidad: "" }])
            }
          >
            + Añadir zona
          </button>

          {/* HORARIOS */}
          <h2 className="page-subtitle">Horarios</h2>

          {horarios.map((h, i) => (
            <div className="filters" key={i}>
              <input
                type="number"
                className="input-filter"
                value={h.dia_semana}
                onChange={(e) => {
                  const copy = [...horarios];
                  copy[i].dia_semana = e.target.value;
                  setHorarios(copy);
                }}
              />

              <input
                type="time"
                className="input-filter"
                value={h.hora}
                onChange={(e) => {
                  const copy = [...horarios];
                  copy[i].hora = e.target.value;
                  setHorarios(copy);
                }}
              />

              <button
                className="btn-danger"
                onClick={() =>
                  setHorarios(
                    horarios.filter((_, idx) => idx !== i)
                  )
                }
              >
                ✕
              </button>
            </div>
          ))}

          <button
            className="btn-secondary"
            onClick={() =>
              setHorarios([
                ...horarios,
                { dia_semana: 1, hora: "" },
              ])
            }
          >
            + Añadir horario
          </button>

          {/* GUARDAR */}
          <button
            className="btn-primary"
            style={{ marginTop: 30, width: "100%" }}
            onClick={guardar}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>

        </div>
      </div>
    </div>
  );
}