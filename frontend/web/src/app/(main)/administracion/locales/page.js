"use client";

import { useEffect, useState } from "react";
import "@/styles/admin-locales.css";

export default function AdminLocales() {
  const [locales, setLocales] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedId, setSelectedId] = useState(null);
  const [confirmText, setConfirmText] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    fetchLocales();
  }, []);

  const fetchLocales = async () => {
    try {
      const res = await fetch(
        "https://reservit.onrender.com/api/establecimientos/admin"
      );
      const data = await res.json();
      setLocales(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando locales:", err);
      setLocales([]);
    }
  };

  // =========================
  // ELIMINAR (ARREGLADO)
  // =========================
  const eliminar = async (id) => {
  try {
    setLoadingDelete(true);

    const token = localStorage.getItem("token");

    await fetch(
      `https://reservit.onrender.com/api/establecimientos/admin/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setSelectedId(null);
    setConfirmText("");
    fetchLocales();

  } catch (err) {
    console.error("Error eliminando:", err);
  } finally {
    setLoadingDelete(false);
  }
};

  const limpiarFiltros = () => {
    setSearch("");
  };

  const filtrados = locales.filter((l) =>
    l.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-locales-page">

      <h1 className="admin-title">Locales</h1>

      {/* FILTROS */}
      <div className="filters-card">
        <input
          placeholder="Buscar local..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="btn-clear" onClick={limpiarFiltros}>
          Limpiar
        </button>
      </div>

      {/* TABLA */}
      <div className="table-card">

        <div className="table-header">
          <span>Nombre</span>
          <span>Tipo</span>
          <span>Activas</span>
          <span>Pasadas</span>
          <span>Usadas</span>
          <span>Total</span>
          <span>Acciones</span>
        </div>

        {filtrados.map((l) => (
          <div key={l.id} className="table-row">

            <span className="local-name">{l.nombre}</span>
            <span className="local-type">{l.tipo}</span>

            <span className="badge badge-green">
              {l.reservas_activas}
            </span>

            <span className="badge badge-orange">
              {l.reservas_pasadas}
            </span>

            <span className="badge badge-blue">
              {l.reservas_usadas}
            </span>

            <span className="badge badge-total">
              {l.reservas_total}
            </span>

            <button
              className="btn-delete"
              onClick={() => setSelectedId(l.id)}
            >
              Eliminar
            </button>

          </div>
        ))}

      </div>

      {/* =========================
          MODAL CONFIRMACIÓN
      ========================= */}
      {selectedId && (
        <div className="modal-overlay">
          <div className="modal">

            <h2>¿Eliminar establecimiento?</h2>

            <p>
              Esta acción es irreversible.<br />
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
                  setSelectedId(null);
                  setConfirmText("");
                }}
              >
                Cancelar
              </button>

              <button
                className="btn-danger"
                disabled={confirmText !== "DELETE" || loadingDelete}
                onClick={() => eliminar(selectedId)}
              >
                {loadingDelete ? "Eliminando..." : "Eliminar"}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}