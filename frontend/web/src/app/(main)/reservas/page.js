"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/misReservas.css";

export default function MisReservas() {
  const [reservas, setReservas] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroTramo, setFiltroTramo] = useState("");

  const router = useRouter();

  useEffect(() => {
    fetchReservas();
  }, []);

  const fetchReservas = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8000/api/reservas/mis", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const raw = await res.json();
    const data = Array.isArray(raw) ? raw : raw.data || [];

    const ordenadas = data.sort(
      (a, b) =>
        new Date(`${a.fecha} ${a.hora}`) -
        new Date(`${b.fecha} ${b.hora}`)
    );

    setReservas(ordenadas);
  };

  const filtrar = (r) => {
    const matchFecha = !filtroFecha || r.fecha === filtroFecha;

    const matchNombre =
      !filtroNombre ||
      r.establecimiento_nombre
        ?.toLowerCase()
        .includes(filtroNombre.toLowerCase());

    const hora = parseInt(r.hora.split(":")[0]);

    const matchTramo =
      !filtroTramo ||
      (filtroTramo === "mañana" && hora < 13) ||
      (filtroTramo === "tarde" && hora >= 13 && hora < 20) ||
      (filtroTramo === "noche" && hora >= 20);

    return matchFecha && matchNombre && matchTramo;
  };

  const filtradas = reservas.filter(filtrar);

  return (
    <div className="reservas-page">
      <div className="reservas-container">

        {/* HEADER */}
        <div className="reservas-header">

          <button
            className="back-btn"
            onClick={() => router.push("/")}
          >
            ← Volver
          </button>

          <div>
            <h1>Mis reservas</h1>
            <p>Consulta y gestiona tus reservas</p>
          </div>

        </div>

        {/* FILTROS */}
        <div className="reservas-filtros">

          <input
            type="date"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
          />

          <input
            placeholder="Buscar establecimiento"
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
          />

          <select
            value={filtroTramo}
            onChange={(e) => setFiltroTramo(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="mañana">Mañana</option>
            <option value="tarde">Tarde</option>
            <option value="noche">Noche</option>
          </select>

          <button
            className="clear-btn"
            onClick={() => {
              setFiltroFecha("");
              setFiltroNombre("");
              setFiltroTramo("");
            }}
          >
            Limpiar
          </button>

        </div>

        {/* LISTA */}
        <div className="reservas-list">

          {filtradas.length === 0 ? (
            <div className="empty">
              No hay reservas con estos filtros
            </div>
          ) : (
            filtradas.map((r) => (
              <div
                key={r.id}
                className="reserva-card"
                onClick={() => router.push(`/reservas/${r.id}`)}
              >

                {/* IMAGEN */}
                <img
                  src={r.imagen_url || "/placeholder.jpg"}
                  className="reserva-img"
                  alt=""
                />

                {/* INFO */}
                <div className="reserva-main">

                  <h3>{r.establecimiento_nombre}</h3>

                  <div className="reserva-inline">
                    <span>{r.fecha}</span>
                    <span>{r.hora}</span>
                    <span>{r.zona}</span>
                  </div>

                </div>

                {/* ESTADO */}
                <div className="reserva-status">
                  {new Date(`${r.fecha} ${r.hora}`) < new Date()
                    ? "Finalizada"
                    : "Activa"}
                </div>

              </div>
            ))
          )}

        </div>

      </div>
    </div>
  );
}