"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import "@/styles/components.css";

const DIAS_SEMANA = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

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
      `https://reservit.onrender.com/api/establecimientos/${id}`
    );
    const data = await res.json();
    setEstablecimiento(data.data || data);
  };

  const eliminar = async () => {
    const token = localStorage.getItem("token");

    await fetch(`https://reservit.onrender.com/api/establecimientos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    router.push("/locales");
  };

  const formatHora = (hora) => {
    if (!hora) return "Sin hora";
    return String(hora).slice(0, 5);
  };

  const zonas = establecimiento?.zonas || [];
  const horarios = establecimiento?.horarios || [];

  const capacidadTotal = useMemo(() => {
    return zonas.reduce((total, zona) => total + Number(zona.capacidad || 0), 0);
  }, [zonas]);

  const horariosPorDia = useMemo(() => {
    return horarios.reduce((acc, horario) => {
      const dia = Number(horario.dia_semana);
      const label = DIAS_SEMANA[dia] || `Día ${horario.dia_semana}`;

      if (!acc[label]) acc[label] = [];
      acc[label].push(formatHora(horario.hora));

      return acc;
    }, {});
  }, [horarios]);

  if (!establecimiento) return <p className="page">Cargando...</p>;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header local-detail-header">
          <div>
            <h1 className="page-title">{establecimiento.nombre}</h1>
            <p className="page-subtitle">
              Panel de gestión del establecimiento
            </p>
          </div>

          <button className="btn-secondary" onClick={() => router.back()}>
            Volver
          </button>
        </div>

        <section className="local-detail-hero">
          <div className="local-detail-image">
            <img
              src={establecimiento.imagen_url || "/placeholder.jpg"}
              alt={establecimiento.nombre}
            />
          </div>

          <div className="local-detail-summary">
            <span className="local-detail-type">{establecimiento.tipo}</span>
            <h2>{establecimiento.nombre}</h2>

            <div className="local-detail-info">
              <div>
                <span>Dirección</span>
                <strong>{establecimiento.direccion || "Sin dirección"}</strong>
              </div>

              <div>
                <span>Teléfono</span>
                <strong>{establecimiento.telefono || "Sin teléfono"}</strong>
              </div>

              <div>
                <span>Zonas</span>
                <strong>{zonas.length}</strong>
              </div>

              <div>
                <span>Capacidad total</span>
                <strong>{capacidadTotal || establecimiento.capacidad || 0}</strong>
              </div>
            </div>

            <div className="local-detail-actions">
              <button
                className="btn-primary"
                onClick={() => router.push(`/locales/${id}/editar`)}
              >
                Editar
              </button>

              <button
                className="btn-secondary"
                onClick={() => router.push(`/locales/${id}/reservas`)}
              >
                Ver reservas
              </button>

              {establecimiento.carta_url && (
                <a
                  className="btn-secondary local-detail-link"
                  href={establecimiento.carta_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver carta
                </a>
              )}

              <button
                className="btn-danger"
                onClick={() => setShowConfirm(true)}
              >
                Eliminar
              </button>
            </div>
          </div>
        </section>

        <section className="local-detail-grid">
          <article className="local-detail-section">
            <div className="local-detail-section-header">
              <div>
                <h2>Zonas del local</h2>
                <p>Lugares disponibles para organizar las reservas.</p>
              </div>
            </div>

            {zonas.length === 0 ? (
              <p className="local-detail-empty">No hay zonas configuradas.</p>
            ) : (
              <div className="local-zones-list">
                {zonas.map((zona) => (
                  <div className="local-zone-card" key={zona.id || zona.nombre}>
                    <div>
                      <span>Zona</span>
                      <strong>{zona.nombre || "Zona sin nombre"}</strong>
                    </div>
                    <p>{Number(zona.capacidad || 0)} plazas</p>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className="local-detail-section">
            <div className="local-detail-section-header">
              <div>
                <h2>Horarios</h2>
                <p>Franjas disponibles para recibir reservas.</p>
              </div>
            </div>

            {Object.keys(horariosPorDia).length === 0 ? (
              <p className="local-detail-empty">No hay horarios configurados.</p>
            ) : (
              <div className="local-schedule-list">
                {Object.entries(horariosPorDia).map(([dia, horas]) => (
                  <div className="local-schedule-row" key={dia}>
                    <strong>{dia}</strong>
                    <div>
                      {horas.sort().map((hora) => (
                        <span key={`${dia}-${hora}`}>{hora}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>
        </section>
      </div>

      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>¿Eliminar establecimiento?</h2>

            <p>
              Esta acción no se puede deshacer.
              <br />
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
