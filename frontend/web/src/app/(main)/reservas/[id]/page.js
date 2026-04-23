"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import "@/styles/components.css";

export default function DetalleReserva() {
  const { id } = useParams();
  const router = useRouter();

  const [reserva, setReserva] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    fetchReserva();
  }, []);

  const fetchReserva = async () => {
    const res = await fetch(`http://localhost:8000/api/reservas/${id}`);
    const data = await res.json();
    setReserva(data);
  };

  const eliminar = async () => {
    await fetch(`http://localhost:8000/api/reservas/${id}`, {
      method: "DELETE",
    });
    router.push("/reservas");
  };

  const generarPDF = () => window.print();

  if (!reserva) return <p>Cargando...</p>;

  return (
    <div className="page">
      <div className="container">

        {/* HEADER */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Reserva</h1>
            <p className="page-subtitle">
              Gestiona tu reserva fácilmente
            </p>
          </div>

          <button className="btn-secondary" onClick={generarPDF}>
            Descargar PDF
          </button>
        </div>

        {/* TOP */}
        <div className="detalle-reserva-top">

          {/* QR */}
          <div className="qr-card">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${reserva.qr_token}`}
              alt="QR"
            />
            <p className="qr-text">Presenta este código en el local</p>
          </div>

          {/* INFO */}
          <div className="reserva-info-card">

            <div className="reserva-img">
              <img
                src={reserva.imagen_url || "/placeholder.jpg"}
                alt="establecimiento"
              />
            </div>

            <h2 className="reserva-title">
              {reserva.establecimiento_nombre}
            </h2>

            <div className="reserva-info-block">
              <p><strong>Cliente:</strong> {reserva.nombre_usuario}</p>
              <p><strong>Personas:</strong> {reserva.num_personas}</p>
              <p><strong>Zona:</strong> {reserva.zona}</p>
              <p><strong>Fecha:</strong> {reserva.fecha}</p>
              <p><strong>Hora:</strong> {reserva.hora}</p>
            </div>

            <p className="reserva-note">
              Las reservas se guardan durante 30 minutos.
            </p>

          </div>

        </div>

        {/* EDIT */}
        <div className="reserva-edit">

          <h2>Cambiar reserva</h2>

          <button className="btn-primary" disabled>
            Próximamente
          </button>

          <div className="reserva-actions">
            <button
              className="btn-secondary"
              onClick={() => setShowConfirm(true)}
            >
              Eliminar
            </button>
          </div>

        </div>

      </div>

      {/*MODAL CONFIRM */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal">

            <h2>¿Eliminar reserva?</h2>

            <p>
              Esta acción no se puede deshacer.
              <br />
              Escribe <strong>DELETE</strong> para confirmar.
            </p>

            <input
              type="text"
              placeholder="Escribe DELETE"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="input-filter"
            />

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowConfirm(false);
                  setConfirmText("");
                }}
              >
                Cancelar
              </button>

              <button
                className="btn-primary"
                disabled={confirmText !== "DELETE"}
                onClick={eliminar}
              >
                Confirmar eliminación
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}