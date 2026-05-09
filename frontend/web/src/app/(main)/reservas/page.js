"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/misReservas.css";

export default function MisReservas() {

  const [reservas, setReservas] = useState([]);

  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroTramo, setFiltroTramo] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("activas");

  const router = useRouter();

  useEffect(() => {
    fetchReservas();
  }, []);

  // =========================
  // FETCH
  // =========================

  const fetchReservas = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:8000/api/reservas/mis",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const raw = await res.json();

      const data = Array.isArray(raw)
        ? raw
        : raw.data || [];

      const ordenadas = data.sort(
        (a, b) =>
          new Date(`${a.fecha} ${a.hora}`).getTime() -
          new Date(`${b.fecha} ${b.hora}`).getTime()
      );

      setReservas(ordenadas);

    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // FILTROS
  // =========================

  const filtrar = (r) => {

    // FECHA
    const matchFecha =
      !filtroFecha ||
      r.fecha === filtroFecha;

    // NOMBRE
    const matchNombre =
      !filtroNombre ||
      r.establecimiento_nombre
        ?.toLowerCase()
        .includes(
          filtroNombre.toLowerCase()
        );

    // TRAMO
    const hora = parseInt(
      r.hora.split(":")[0]
    );

    const matchTramo =
      !filtroTramo ||
      (filtroTramo === "mañana" &&
        hora < 13) ||
      (filtroTramo === "tarde" &&
        hora >= 13 &&
        hora < 20) ||
      (filtroTramo === "noche" &&
        hora >= 20);

    // =========================
    // ESTADO
    // =========================

    const fechaReserva = new Date(
      `${r.fecha}T${r.hora}`
    );

    const pasada =
      fechaReserva < new Date();

    const activa = !pasada;

    const finalizada =
      pasada &&
      r.qr_usado === true;

    const perdida =
      pasada &&
      r.qr_usado === false;

    const matchEstado =
      (filtroEstado === "activas" &&
        activa) ||
      (filtroEstado === "finalizadas" &&
        finalizada) ||
      (filtroEstado === "perdidas" &&
        perdida);

    return (
      matchFecha &&
      matchNombre &&
      matchTramo &&
      matchEstado
    );
  };

  const filtradas =
    reservas.filter(filtrar);

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

            <p>
              Consulta y gestiona tus reservas
            </p>
          </div>

        </div>

        {/* ESTADOS */}
        <div className="estado-filters">

          <button
            className={
              filtroEstado === "activas"
                ? "estado-btn active"
                : "estado-btn"
            }
            onClick={() =>
              setFiltroEstado("activas")
            }
          >
            Activas
          </button>

          <button
            className={
              filtroEstado === "finalizadas"
                ? "estado-btn active"
                : "estado-btn"
            }
            onClick={() =>
              setFiltroEstado("finalizadas")
            }
          >
            Finalizadas
          </button>

          <button
            className={
              filtroEstado === "perdidas"
                ? "estado-btn active"
                : "estado-btn"
            }
            onClick={() =>
              setFiltroEstado("perdidas")
            }
          >
            Perdidas
          </button>

        </div>

        {/* FILTROS */}
        <div className="reservas-filtros">

          {/* FECHA */}
          <input
            type="date"
            value={filtroFecha}
            onChange={(e) =>
              setFiltroFecha(
                e.target.value
              )
            }
          />

          {/* NOMBRE */}
          <input
            placeholder="Buscar establecimiento"
            value={filtroNombre}
            onChange={(e) =>
              setFiltroNombre(
                e.target.value
              )
            }
          />

          {/* TRAMO */}
          <select
            value={filtroTramo}
            onChange={(e) =>
              setFiltroTramo(
                e.target.value
              )
            }
          >
            <option value="">
              Todos
            </option>

            <option value="mañana">
              Mañana
            </option>

            <option value="tarde">
              Tarde
            </option>

            <option value="noche">
              Noche
            </option>
          </select>

          {/* LIMPIAR */}
          <button
            className="clear-btn"
            onClick={() => {

              setFiltroFecha("");
              setFiltroNombre("");
              setFiltroTramo("");
              setFiltroEstado("activas");

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

            filtradas.map((r) => {

              const fechaReserva =
                new Date(
                  `${r.fecha}T${r.hora}`
                );

              const esPasada =
                fechaReserva < new Date();

              const estadoTexto =
                !esPasada
                  ? "Activa"
                  : r.qr_usado
                  ? "Finalizada"
                  : "Perdida";

              const estadoClase =
                !esPasada
                  ? "status-activa"
                  : r.qr_usado
                  ? "status-finalizada"
                  : "status-perdida";

              return (

                <div
                  key={r.id}
                  className="reserva-card"
                  onClick={() =>
                    router.push(
                      `/reservas/${r.id}`
                    )
                  }
                >

                  {/* IMAGEN */}
                  <img
                    src={
                      r.imagen_url ||
                      "/placeholder.jpg"
                    }
                    className="reserva-img"
                    alt=""
                  />

                  {/* INFO */}
                  <div className="reserva-main">

                    <h3>
                      {r.establecimiento_nombre}
                    </h3>

                    <div className="reserva-inline">

                      <span>
                        {r.fecha}
                      </span>

                      <span>
                        {r.hora}
                      </span>

                      <span>
                        {r.zona}
                      </span>

                    </div>

                  </div>

                  {/* ESTADO */}
                  <div
                    className={`reserva-status ${estadoClase}`}
                  >
                    {estadoTexto}
                  </div>

                </div>
              );
            })
          )}

        </div>

      </div>

    </div>
  );
}