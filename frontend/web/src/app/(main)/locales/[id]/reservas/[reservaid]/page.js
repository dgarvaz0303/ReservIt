"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import "@/styles/detalle-reserva.css";

export default function DetalleReserva() {
  const params = useParams();
  const router = useRouter();

  const reservaid = Array.isArray(params.reservaid)
    ? params.reservaid[0]
    : params.reservaid;

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [reserva, setReserva] = useState(null);
  const [validacionEstado, setValidacionEstado] = useState(null);

  useEffect(() => {
    if (reservaid) fetchReserva();
  }, [reservaid]);

  const fetchReserva = async () => {
    try {
      const res = await fetch(
        `https://reservit.onrender.com/api/reservas/${reservaid}`
      );
      const data = await res.json();
      setReserva(data);
    } catch (err) {
      console.error(err);
    }
  };

  const validarQR = async (qr_token) => {
    try {
      const res = await fetch(
        `https://reservit.onrender.com/api/reservas/usar/${qr_token}`,
        { method: "POST" }
      );

      if (res.ok) {
        setValidacionEstado("ok");

        setReserva((prev) => ({
          ...prev,
          qr_usado: true,
        }));
      } else {
        setValidacionEstado("error");
      }

      setTimeout(() => setValidacionEstado(null), 1500);
    } catch {
      setValidacionEstado("error");
    }
  };

  const eliminarReserva = async () => {
    const token = localStorage.getItem("token");

    await fetch(
      `https://reservit.onrender.com/api/reservas/${reservaid}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Reserva eliminada");

    //  REDIRECCIÓN 
    router.push(`/locales/${id}/reservas`);
  };

  if (!reserva) return <p className="page">Cargando...</p>;

  return (
    <div className="page">
      <div className="container">

        {/* HEADER */}
        <div className="page-header">
          <h1 className="page-title">Detalle reserva</h1>

          <button
            className="btn-secondary"
            onClick={() => router.push(`/locales/${id}/reservas`)}
          >
            ← Volver
          </button>
        </div>

        {/* ESTADO */}
        <div
          className={`estado-big ${
            reserva.qr_usado ? "estado-activa" : "estado-pendiente"
          }`}
        >
          {reserva.qr_usado ? "ACTIVA" : "PENDIENTE"}
        </div>

        {/* INFO */}
        <div className="card reserva-info-card">

          <h2>{reserva.establecimiento_nombre}</h2>

          <p>{reserva.nombre_usuario}</p>
          <p>{reserva.fecha} - {reserva.hora}</p>
          <p>{reserva.num_personas} personas</p>
          <p>Zona: {reserva.zona || "General"}</p>

        </div>

        {/* ACCIONES */}
        <div className="reserva-actions">

          {!reserva.qr_usado && (
            <button
              className="btn-primary"
              onClick={() => {
                const fakeQR = prompt("Introduce QR token");
                if (fakeQR) validarQR(fakeQR);
              }}
            >
              Validar QR
            </button>
          )}

          <button
            className="btn-danger"
            onClick={eliminarReserva}
          >
            Eliminar reserva
          </button>

        </div>

      </div>

      {/* OVERLAY */}
      {validacionEstado && (
        <div
          className={`validation-overlay ${
            validacionEstado === "ok" ? "success" : "error"
          }`}
        >
          {validacionEstado === "ok"
            ? "✔ Reserva validada"
            : "✖ QR inválido"}
        </div>
      )}
    </div>
  );
}