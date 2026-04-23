"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import "@/styles/components.css";

export default function DetalleEstablecimientoSupervisor() {
  const { id } = useParams();
  const router = useRouter();

  const [establecimiento, setEstablecimiento] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    fetchEstablecimiento();
  }, []);

  const fetchEstablecimiento = async () => {
    const res = await fetch(
      `http://localhost:8000/api/establecimientos/${id}`
    );
    const data = await res.json();
    setEstablecimiento(data.data || data);
  };

  const eliminar = async () => {
    const token = localStorage.getItem("token");

    await fetch(
      `http://localhost:8000/api/establecimientos/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    router.push("/locales");
  };

  if (!establecimiento) return <p className="page">Cargando...</p>;

  return (
    <div className="page">
      <div className="container">

        {/* HEADER */}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              {establecimiento.nombre}
            </h1>
            <p className="page-subtitle">
              Panel de gestión del establecimiento
            </p>
          </div>

          <button
            className="btn-secondary"
            onClick={() => router.back()}
          >
            ← Volver
          </button>
        </div>

        {/* CARD PRINCIPAL */}
        <div className="card">

          {/* IMAGEN */}
          <div className="est-image">
            <img
              src={establecimiento.imagen_url || "/placeholder.jpg"}
              alt="establecimiento"
            />
          </div>

          {/* INFO */}
          <div className="est-content">

            <h2 className="est-title">
              {establecimiento.nombre}
            </h2>

            <p className="est-info">
              <strong>Tipo:</strong> {establecimiento.tipo}
            </p>

            <p className="est-info">
              <strong>Dirección:</strong> {establecimiento.direccion}
            </p>

            <p className="est-info">
              <strong>Teléfono:</strong> {establecimiento.telefono}
            </p>

            <p className="est-info">
              <strong>Capacidad:</strong> {establecimiento.capacidad}
            </p>

            {/* ACCIONES */}
            <div className="est-actions">

              <button
                className="btn-primary"
                onClick={() =>
                  router.push(`/establecimientos/editar/${id}`)
                }
              >
                Editar
              </button>

              <button
                className="btn-secondary"
                onClick={() =>
                  router.push(`/locales/${id}/reservas`)
                }
              >
                Ver reservas
              </button>

              <button
                className="btn-danger"
                onClick={() => setShowConfirm(true)}
              >
                Eliminar
              </button>

            </div>

          </div>
        </div>

      </div>

      {/* MODAL */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal">

            <h2>¿Eliminar establecimiento?</h2>

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