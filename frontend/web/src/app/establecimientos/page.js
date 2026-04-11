"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
    <div>
      <h1>Establecimientos</h1>

      <button onClick={() => router.push("/")}>
        Volver al inicio
      </button>

      {establecimientos.map((est) => (
        <div
          key={est.id}
          style={{
            border: "1px solid black",
            margin: "10px",
            padding: "10px",
          }}
        >
          {/* Imagen placeholder */}
          <div
            style={{
              height: "150px",
              background: "#ccc",
              marginBottom: "10px",
            }}
          >
            Imagen
          </div>

          <h2>{est.nombre}</h2>
          <p>Tipo: {est.tipo}</p>
          <p>Dirección: {est.direccion}</p>
          <p>Capacidad: {est.capacidad}</p>

          <button onClick={() => alert("Reservar próximamente")}>
            Reservar
          </button>

          <button onClick={() => window.open(est.carta_url)}>
            Descargar carta
          </button>
        </div>
      ))}
    </div>
  );
}