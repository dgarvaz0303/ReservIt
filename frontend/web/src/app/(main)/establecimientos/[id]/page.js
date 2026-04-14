"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "@/styles/detalle.css";

export default function EstablecimientoDetalle() {
  const { id } = useParams();

  const [establecimiento, setEstablecimiento] = useState(null);
  const [fecha, setFecha] = useState("");
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [personas, setPersonas] = useState(1);
  const [seleccion, setSeleccion] = useState(null);
  const [mesActual, setMesActual] = useState(new Date());
  const [ocupacionMes, setOcupacionMes] = useState({});

  useEffect(() => {
    fetchEstablecimiento();

    const hoy = new Date().toISOString().split("T")[0];
    setFecha(hoy);
    fetchDisponibilidad(hoy);
  }, []);

  useEffect(() => {
    fetchMes();
  }, [mesActual]);

  const fetchEstablecimiento = async () => {
    const res = await fetch(`http://localhost:8000/api/establecimientos/${id}`);
    const data = await res.json();
    setEstablecimiento(data.data || data);
  };

  const fetchDisponibilidad = async (fechaSeleccionada) => {
    const res = await fetch(
      `http://localhost:8000/api/disponibilidad?establecimiento_id=${id}&fecha=${fechaSeleccionada}`
    );
    const data = await res.json();
    setDisponibilidad(Array.isArray(data) ? data : data.data || []);
  };

  const fetchMes = async () => {
    try {
      const year = mesActual.getFullYear();
      const month = mesActual.getMonth() + 1;

      const res = await fetch(
        `http://localhost:8000/api/disponibilidad/mes?establecimiento_id=${id}&year=${year}&month=${month}`
      );

      const raw = await res.json();
      const data = Array.isArray(raw) ? raw : raw.data || [];

      const map = {};
      data.forEach((d) => {
        map[d.fecha] = d.ocupacion;
      });

      setOcupacionMes(map);
    } catch {
      setOcupacionMes({});
    }
  };

  const handleReservar = async () => {
    if (!seleccion) return;

    const token = localStorage.getItem("token");

    await fetch("http://localhost:8000/api/reservas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        establecimiento_id: Number(id),
        zona_id: seleccion.zona_id,
        fecha,
        hora: seleccion.hora,
        num_personas: personas,
      }),
    });

    fetchDisponibilidad(fecha);
    setSeleccion(null);
  };

  const ahora = new Date();

  const horaPasada = (hora) => {
    const [h, m] = hora.split(":");
    const d = new Date(fecha);
    d.setHours(h, m);
    return d < ahora;
  };

  const zonas = {};
  (disponibilidad || []).forEach((item) => {
    if (!zonas[item.zona]) zonas[item.zona] = [];
    zonas[item.zona].push(item);
  });

  const generarCalendario = () => {
    const year = mesActual.getFullYear();
    const month = mesActual.getMonth();
    const ultimo = new Date(year, month + 1, 0);

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const dias = [];

    for (let i = 1; i <= ultimo.getDate(); i++) {
      const d = new Date(year, month, i);

      dias.push({
        fecha: d.toISOString().split("T")[0],
        label: i,
        pasado: d < hoy,
      });
    }

    return dias;
  };

  const dias = generarCalendario();

  const prevMes = () => {
    const d = new Date(mesActual);
    d.setMonth(d.getMonth() - 1);
    setMesActual(d);
  };

  const nextMes = () => {
    const d = new Date(mesActual);
    d.setMonth(d.getMonth() + 1);
    setMesActual(d);
  };

  if (!establecimiento) return <p>Cargando...</p>;

  return (
    <div className="page">
      <div className="container detalle">

        {/* TOP */}
        <div className="detalle-top">

          <div className="detalle-img">
            <img src={establecimiento.imagen_url || "/placeholder.jpg"} />
          </div>

          <div className="detalle-card">

            {/* INFO MEJORADA */}
            <div className="detalle-info-block">
              <p><strong>Nombre:</strong> {establecimiento.nombre}</p>
              <p><strong>Tipo:</strong> {establecimiento.tipo}</p>
              <p><strong>Dirección:</strong> {establecimiento.direccion}</p>
              <p><strong>Teléfono:</strong> {establecimiento.telefono}</p>
            </div>

            {/* ACCIONES */}
            <div className="card-actions">
              <a href={`tel:${establecimiento.telefono}`}>
                <button className="btn-secondary">Contactar</button>
              </a>

              <button className="btn-secondary">Carta PDF</button>
            </div>

            {/* CTA */}
            <button
              className="btn-primary full"
              disabled={!seleccion}
              onClick={handleReservar}
            >
              Confirmar reserva
            </button>

          </div>
        </div>

        {/* CALENDARIO HEADER */}
        <div className="calendar-header">

        <button className="calendar-nav" onClick={prevMes}>
            ←
        </button>

        <h2 className="calendar-title">
            {mesActual.toLocaleString("es-ES", {
            month: "long",
            year: "numeric",
            })}
        </h2>

        <button className="calendar-nav" onClick={nextMes}>
            →
        </button>

        </div>

        {/* CALENDARIO */}
        <div className="calendar-grid">
          {dias.map((dia) => {
            const ocupacion = ocupacionMes[dia.fecha] || 0;

            let estado = "ok";
            if (ocupacion > 0.7) estado = "full";
            else if (ocupacion > 0.4) estado = "low";

            return (
              <button
                key={dia.fecha}
                disabled={dia.pasado}
                className={`calendar-day ${estado} ${
                  fecha === dia.fecha ? "active" : ""
                }`}
                onClick={() => {
                  setFecha(dia.fecha);
                  fetchDisponibilidad(dia.fecha);
                  setSeleccion(null);
                }}
              >
                {dia.label}
              </button>
            );
          })}
        </div>

        {/* PERSONAS */}
        <div className="reserva-controls">
          <label>Número de personas</label>

          <div className="personas-control">
            <button onClick={() => setPersonas(Math.max(1, personas - 1))}>-</button>
            <span>{personas}</span>
            <button onClick={() => setPersonas(personas + 1)}>+</button>
          </div>
        </div>

        {/* ZONAS NUEVAS */}
        <div className="zonas-flex">
          {Object.keys(zonas).map((zona) => {

            const seen = new Set();
            const horas = zonas[zona].filter((item) => {
              const key = item.hora + "-" + item.zona_id;
              if (seen.has(key)) return false;
              seen.add(key);
              return true;
            });

            return (
              <div key={zona} className="zona-flex-card">

                <h2 className="zona-title">
                  {zona.toUpperCase()}
                </h2>

                <div className="horas-grid">
                  {horas.map((item, i) => {
                    const disabled =
                      item.disponibles < personas || horaPasada(item.hora);

                    return (
                      <button
                        key={i}
                        disabled={disabled}
                        className={`hora-btn ${
                          seleccion?.hora === item.hora &&
                          seleccion?.zona_id === item.zona_id
                            ? "active"
                            : ""
                        }`}
                        onClick={() => setSeleccion(item)}
                      >
                        {item.hora}
                      </button>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}