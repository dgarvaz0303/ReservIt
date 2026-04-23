"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/components.css";

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
    <div className="page">
      <div className="container">

        {/* HEADER */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Mis establecimientos</h1>
            <p className="page-subtitle">
              Gestiona tus locales fácilmente
            </p>
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
          <p className="perfil-empty">
            No hay locales registrados
          </p>
        ) : (
          <div className="est-list">
            {establecimientos.map((e) => (
              <div key={e.id} className="est-card">

                {/* CLICKABLE */}
                <div
                  onClick={() =>
                    router.push(`/establecimientos/${e.id}`)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <div className="est-image">
                    <img
                      src={e.imagen_url || "/placeholder.jpg"}
                      alt={e.nombre}
                    />
                  </div>

                  <div className="est-content">
                    <h2 className="est-title">{e.nombre}</h2>
                    <p className="est-info">{e.direccion}</p>
                  </div>
                </div>

                {/* ACCIONES */}
                <div className="est-actions">
                  <button
                    className="btn-secondary"
                    onClick={() =>
                      router.push(`/establecimientos/${e.id}`)
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
              Esta acción no se puede deshacer. <br />
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