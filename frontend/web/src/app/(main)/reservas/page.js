"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/components.css";

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

    const data = await res.json();

    const ordenadas = data.sort(
      (a, b) =>
        new Date(`${a.fecha} ${a.hora}`) -
        new Date(`${b.fecha} ${b.hora}`)
    );

    setReservas(ordenadas);
  };

  const filtrar = (reserva) => {
    const matchFecha = !filtroFecha || reserva.fecha === filtroFecha;

    const matchNombre =
      !filtroNombre ||
      reserva.establecimiento_nombre
        ?.toLowerCase()
        .includes(filtroNombre.toLowerCase());

    const hora = parseInt(reserva.hora.split(":")[0]);

    const matchTramo =
      !filtroTramo ||
      (filtroTramo === "mañana" && hora < 13) ||
      (filtroTramo === "tarde" && hora >= 13 && hora < 20) ||
      (filtroTramo === "noche" && hora >= 20);

    return matchFecha && matchNombre && matchTramo;
  };

  return (
    <div className="page">
      <div className="container">

        <h1>Mis reservas</h1>

        {/* FILTROS */}
        <div className="filters">

          <input
            type="date"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
          />

          <input
            placeholder="Buscar por nombre"
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
          />

          <select onChange={(e) => setFiltroTramo(e.target.value)}>
            <option value="">Todos</option>
            <option value="mañana">Mañana</option>
            <option value="tarde">Tarde</option>
            <option value="noche">Noche</option>
          </select>

        </div>

        {/* LISTA */}
        <div className="reservas-list">
          {reservas.filter(filtrar).map((r) => (
            <div
              key={r.id}
              className="reserva-card"
              onClick={() => router.push(`/reservas/${r.id}`)}
            >
              <div className="reserva-img">
                <img src={r.imagen_url} alt={r.establecimiento_nombre} />
              </div>

              <div className="reserva-content">

                <h2>{r.establecimiento_nombre}</h2>

                <p className="reserva-info">
                  📅 {r.fecha} - {r.hora}
                </p>

                <p className="reserva-info">
                  Zona: {r.zona}
                </p>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}