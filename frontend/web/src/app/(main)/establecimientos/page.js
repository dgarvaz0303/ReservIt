"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/components.css";

export default function EstablecimientosPage() {
  const [establecimientos, setEstablecimientos] = useState([]);
  const [search, setSearch] = useState("");
  const [tipo, setTipo] = useState("");

  const router = useRouter();

  useEffect(() => {
    fetchEstablecimientos();
  }, []);

  const fetchEstablecimientos = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/establecimientos");
      const data = await res.json();
      setEstablecimientos(data);
    } catch (err) {
      console.log(err);
    }
  };

  const filtrados = establecimientos.filter((est) => {
    const matchNombre = est.nombre.toLowerCase().includes(search.toLowerCase());
    const matchTipo = tipo ? est.tipo === tipo : true;
    return matchNombre && matchTipo;
  });

  return (
    <div className="page">
      <div className="container">

        <div className="page-header">

          <div>
            <h1 className="page-title">Establecimientos</h1>
            <p className="page-subtitle">
              Descubre y reserva en los mejores lugares cerca de ti
            </p>
          </div>

          <button
            className="btn-secondary"
            onClick={() => router.push("/")}
          >
            ← Volver al Inicio
          </button>

        </div>

        {/* FILTROS */}
        <div className="filters">
          <input
            type="text"
            placeholder="Buscar establecimiento..."
            className="input-filter"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="select-filter"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="Restaurante">Restaurante</option>
            <option value="Bar">Bar</option>
            <option value="Pizzería">Pizzería</option>
          </select>
        </div>

        {/* LISTADO */}
        <div className="est-list">
          {filtrados.map((est) => (
            <div
              key={est.id}
              className="est-card"
              onClick={() => router.push(`/establecimientos/${est.id}`)}
            >
              <div className="est-image">
                {est.imagen_url ? (
                  <img
                    src={est.imagen_url}
                    alt={est.nombre}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  "Sin imagen"
                )}
              </div>

              <div className="est-content">
                <h2 className="est-title">{est.nombre}</h2>

                <p className="est-info">{est.direccion}</p>
                <p className="est-info">Capacidad: {est.capacidad}</p>

                <div className="est-actions">
                  <button
                    className="btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert("Reservar próximamente");
                    }}
                  >
                    Reservar
                  </button>

                  <button
                    className="btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(est.carta_url);
                    }}
                  >
                    Carta
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}