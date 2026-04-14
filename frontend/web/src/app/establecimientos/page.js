"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/components.css";

export default function EstablecimientosPage() {
  const [establecimientos, setEstablecimientos] = useState([]);
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

  return (
    <div className="container">
      <h1>Establecimientos</h1>

      <button className="btn-secondary" onClick={() => router.push("/")}>
        ← Volver
      </button>

      <div className="est-list">
        {establecimientos.map((est) => (
          <div
            key={est.id}
            className="est-card"
            onClick={() => router.push(`/establecimientos/${est.id}`)}
          >
            {/* Imagen */}
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

            {/* Contenido */}
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
  );
}