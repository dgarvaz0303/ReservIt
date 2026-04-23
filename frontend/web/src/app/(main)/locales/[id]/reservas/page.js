"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "@/styles/components.css";

export default function ReservasEstablecimiento() {
  const { id } = useParams();

  const [reservas, setReservas] = useState([]);
  const [fecha, setFecha] = useState(new Date());
  const [filtro, setFiltro] = useState("todas");

  useEffect(() => {
    fetchReservas();
  }, [fecha]);

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const fetchReservas = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:8000/api/reservas/establecimiento/${id}?fecha=${formatDate(fecha)}`,
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
        );

      const data = await res.json();
      setReservas(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const filtrarReservas = () => {
    if (filtro === "todas") return reservas;

    return reservas.filter((r) => {
      const hora = parseInt(r.hora.split(":")[0]);

      if (filtro === "mañana") return hora >= 8 && hora <= 12;
      if (filtro === "tarde") return hora >= 13 && hora <= 19;
      if (filtro === "noche") return hora >= 20;

      return true;
    });
  };

  const cambiarDia = (dias) => {
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);

    if (nuevaFecha < new Date().setHours(0, 0, 0, 0)) return;

    setFecha(nuevaFecha);
  };

  const reservasFiltradas = filtrarReservas();

  return (
    <div className="page">
      <div className="container">

        {/* HEADER */}
        <div className="page-header">
          <h1 className="page-title">Reservas</h1>
          <p className="page-subtitle">
            Gestiona las reservas de tu establecimiento
          </p>
        </div>

        {/* FECHA */}
        <div className="card" style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <button className="btn-secondary" onClick={() => cambiarDia(-1)}>
            ←
          </button>

          <h2 style={{ color: "var(--color-primary)", margin: 0 }}>
            {fecha.toLocaleDateString("es-ES", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </h2>

          <button className="btn-secondary" onClick={() => cambiarDia(1)}>
            →
          </button>
        </div>

        {/* FILTROS */}
        <div className="filters-bar">

          <button
            className={`btn-secondary ${filtro === "mañana" ? "btn-accent" : ""}`}
            onClick={() => setFiltro("mañana")}
          >
            Mañana
          </button>

          <button
            className={`btn-secondary ${filtro === "tarde" ? "btn-accent" : ""}`}
            onClick={() => setFiltro("tarde")}
          >
            Tarde
          </button>

          <button
            className={`btn-secondary ${filtro === "noche" ? "btn-accent" : ""}`}
            onClick={() => setFiltro("noche")}
          >
             Noche
          </button>

          <button
            className="btn-secondary"
            onClick={() => setFiltro("todas")}
          >
            Todas
          </button>

        </div>

        {/* LISTA */}
        <div className="reservas-list">

          {reservasFiltradas.length === 0 ? (
            <div className="card">
              <p className="perfil-empty">
                No hay reservas para este día
              </p>
            </div>
          ) : (
            reservasFiltradas.map((r) => (
              <div
                key={r.id}
                className="reserva-card"
                onClick={() =>
                  window.location.href = `/reservas/${r.id}`
                }
              >
                {/* LATERAL COLOR */}
                <div style={{
                  width: 6,
                  background: "var(--color-success)"
                }} />

                {/* CONTENIDO */}
                <div className="reserva-content">

                  <h2>{r.nombre_cliente}</h2>

                  <p className="reserva-info">
                    {r.hora} · 👥 {r.personas} personas
                  </p>

                  <p className="reserva-info">
                    {r.zona_nombre || "Zona general"}
                  </p>

                </div>

              </div>
            ))
          )}

        </div>

      </div>
    </div>
  );
}