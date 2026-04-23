"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MisEstablecimientos() {
  const [establecimientos, setEstablecimientos] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [confirmText, setConfirmText] = useState("");

  const router = useRouter();

  useEffect(() => {
    fetchEstablecimientos();
  }, []);

  const fetchEstablecimientos = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      "http://localhost:8000/api/establecimientos/propietario",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    setEstablecimientos(data);
  };

  const eliminar = async () => {
    const token = localStorage.getItem("token");

    await fetch(
      `http://localhost:8000/api/establecimientos/${selectedId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setSelectedId(null);
    setConfirmText(""); 
    fetchEstablecimientos();
  };

  return (
    <div>
      <h1>Mis establecimientos</h1>

      <button onClick={() => router.push("/establecimientos/crear")}>
        Crear nuevo
      </button>

      {establecimientos.map((e) => (
        <div key={e.id} style={{ border: "1px solid #ccc", margin: 10 }}>
          <div
            onClick={() => router.push(`/establecimientos/${e.id}`)}
            style={{ cursor: "pointer" }}
          >
            <img src={e.imagen_url} width={200} />
            <h2>{e.nombre}</h2>
          </div>

          {/* BOTÓN ELIMINAR */}
          <button onClick={() => setSelectedId(e.id)}>
            Eliminar
          </button>
        </div>
      ))}

      {/* MODAL */}
      {selectedId && (
        <div>
          <div>
            <h2>¿Seguro que quieres eliminarlo?</h2>

            <p>
              Esta acción no se puede deshacer. <br />
              Escribe <strong>DELETE</strong> para confirmar.
            </p>

            <input
              type="text"
              placeholder="Escribe DELETE"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
            />

            <button
              onClick={eliminar}
              disabled={confirmText !== "DELETE"}
            >
              Sí, eliminar
            </button>

            <button
              onClick={() => {
                setSelectedId(null);
                setConfirmText("");
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}