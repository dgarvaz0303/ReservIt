"use client";

import { useEffect, useState } from "react";
import "@/styles/admin-locales.css";

export default function AdminLocales() {
  const [locales, setLocales] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchLocales();
  }, []);

  const fetchLocales = async () => {
    const res = await fetch("http://localhost:8000/api/establecimientos/admin");
    const data = await res.json();
    setLocales(Array.isArray(data) ? data : []);
  };

  const eliminar = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:8000/api/establecimientos/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchLocales();
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
              onClick={() => eliminar(l.id)}
            >
              Eliminar
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}