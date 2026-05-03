"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import "@/styles/reserva-detalle.css";

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

  if (!reserva) return <p className="page">Cargando...</p>;

  return (
    <div className="reserva-page">
      <div className="reserva-container">

        {/* HEADER */}
        <div className="reserva-header">
          <div>
            <h1>Tu reserva</h1>
            <p>Presenta el QR en el establecimiento</p>
          </div>

          <button className="btn-primary" onClick={generarPDF}>
            Descargar en formato PDF
          </button>
        </div>

        {/* CONTENT */}
        <div className="reserva-content">

          {/* QR */}
          <div className="qr-card">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${reserva.qr_token}`}
              alt="QR"
            />
            <p>Escanéalo en el local</p>
          </div>

          {/* INFO */}
          <div className="reserva-card">

            <h2 className="reserva-title">
              {reserva.establecimiento_nombre}
            </h2>

            <div className="reserva-grid">

              <div className="info-box">
                <span>Cliente</span>
                <strong>{reserva.nombre_usuario}</strong>
              </div>

              <div className="info-box">
                <span>Personas</span>
                <strong>{reserva.num_personas}</strong>
              </div>

              <div className="info-box">
                <span>Zona</span>
                <strong>{reserva.zona}</strong>
              </div>

              <div className="info-box">
                <span>Fecha</span>
                <strong>{reserva.fecha}</strong>
              </div>

              <div className="info-box">
                <span>Hora</span>
                <strong>{reserva.hora}</strong>
              </div>

            </div>

            <p className="reserva-warning">
              Llega con puntualidad o podrías perder tu reserva
            </p>

            <div className="reserva-actions">
              <button
                className="btn-danger"
                onClick={() => setShowConfirm(true)}
              >
                Eliminar reserva
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* MODAL */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal">

            <h2>¿Eliminar reserva?</h2>

            <p>
              Esta acción no se puede deshacer.<br />
              Escribe <strong>DELETE</strong> para confirmar.
            </p>

            <input
              type="text"
              placeholder="DELETE"
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
                className="btn-danger"
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