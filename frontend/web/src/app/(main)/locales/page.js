"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/mis-establecimientos.css";

export default function MisEstablecimientos() {
  const [establecimientos, setEstablecimientos] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [confirmText, setConfirmText] = useState("");

  const router = useRouter();

  useEffect(() => {
    fetchEstablecimientos();
  }, []);

  const fetchEstablecimientos = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setEstablecimientos([]);
        return;
      }

      const res = await fetch(
        "http://localhost:8000/api/establecimientos/propietario",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setEstablecimientos([]);
        return;
      }

      setEstablecimientos(Array.isArray(data) ? data : []);

    } catch (err) {
      console.log(err);
      setEstablecimientos([]);
    }
  };

  const eliminar = async () => {
    const token = localStorage.getItem("token");

    await fetch(
      `http://localhost:8000/api/establecimientos/${selectedId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setSelectedId(null);
    setConfirmText("");
    fetchEstablecimientos();
  };

  return (
    <div className="misest-page">
      <div className="misest-container">

        {/* HEADER */}
        <div className="misest-header">

          <div className="misest-header-left">
            <button
              className="btn-back"
              onClick={() => router.push("/")}
            >
              ← Inicio
            </button>

            <div>
              <h1 className="misest-title">Mis establecimientos</h1>
              <p className="misest-subtitle">
                Gestiona tus locales fácilmente
              </p>
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={() =>
              router.push("/locales/crear-establecimiento")
            }
          >
            + Crear
          </button>
        </div>

        {/* LISTA */}
        {establecimientos.length === 0 ? (
          <div className="misest-empty">
            <p>No tienes establecimientos todavía</p>
          </div>
        ) : (
          <div className="misest-grid">
            {establecimientos.map((e) => (
              <div key={e.id} className="misest-card">

                {/* IMAGEN */}
                <div
                  className="misest-image"
                  onClick={() => router.push(`/locales/${e.id}`)}
                >
                  <img
                    src={e.imagen_url || "/placeholder.jpg"}
                    alt={e.nombre}
                  />
                </div>

                {/* INFO */}
                <div
                  className="misest-content"
                  onClick={() => router.push(`/locales/${e.id}`)}
                >
                  <h2>{e.nombre}</h2>
                  <p>{e.direccion}</p>
                </div>

                {/* ACCIONES */}
                <div className="misest-actions">

                  <button
                    className="btn-secondary"
                    onClick={() =>
                      router.push(`/locales/${e.id}`)
                    }
                  >
                    Ver
                  </button>

                  <button
                    className="btn-danger"
                    onClick={() => setSelectedId(e.id)}
                  >
                    Eliminar
                  </button>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* MODAL */}
      {selectedId && (
        <div className="modal-overlay">
          <div className="modal">

            <h2>¿Eliminar establecimiento?</h2>

            <p>
              Esta acción no se puede deshacer.<br />
              Escribe <strong>DELETE</strong> para continuar.
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
                disabled={confirmText !== "DELETE"}
                onClick={eliminar}
              >
                Eliminar
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}