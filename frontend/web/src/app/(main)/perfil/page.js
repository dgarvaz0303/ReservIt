"use client";

import { useEffect, useState } from "react";
import "@/styles/components.css";

export default function PerfilPage() {
  const [user, setUser] = useState(null);
  const [historial, setHistorial] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    cargarUsuario();
    cargarHistorial();
  }, []);

  const cargarUsuario = () => {
    const nombre = localStorage.getItem("nombre");
    const rol = localStorage.getItem("rol");

    setUser({ nombre, rol });
  };

  const cargarHistorial = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8000/api/reservas/mis", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    const reservas = Array.isArray(data) ? data : data.data || [];

    const pasadas = reservas.filter((r) => {
      const fecha = new Date(`${r.fecha} ${r.hora}`);
      return fecha < new Date();
    });

    setHistorial(pasadas);
  };

  const eliminarCuenta = async () => {
    try {
      const token = localStorage.getItem("token");

      await fetch("http://localhost:8000/api/usuarios/me", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.clear();
      window.location.href = "/login";
    } catch (err) {
      console.log(err);
    }
  };

  if (!user) return <p className="text-center">Cargando...</p>;

  return (
    <div className="page">
      <div className="container">

        {/* HEADER */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Mi Perfil</h1>
            <p className="page-subtitle">
              Gestiona tu cuenta y revisa tu actividad
            </p>
          </div>
        </div>

        {/* INFO */}
        <div className="card perfil-card">
          <h2 className="section-title">Información</h2>

          <p className="perfil-text">
            <strong>Nombre:</strong> {user.nombre}
          </p>

          <p className="perfil-text">
            <strong>Rol:</strong> {user.rol}
          </p>
        </div>

        {/* HISTORIAL */}
        <div className="card perfil-card">
          <h2 className="section-title">Historial de reservas</h2>

          <div className="historial-scroll">
            {historial.length === 0 ? (
              <p className="perfil-empty">
                No hay reservas pasadas
              </p>
            ) : (
              historial.map((r) => (
                <div key={r.id} className="historial-card">

                  <img
                    src={r.imagen_url || "/placeholder.jpg"}
                    alt={r.establecimiento_nombre}
                  />

                  <div>
                    <h3>{r.establecimiento_nombre}</h3>
                    <p>{r.fecha} - {r.hora}</p>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>

        {/* ACCIONES */}
        <div className="card perfil-card">
          <h2 className="section-title">Acciones</h2>

          <div className="perfil-actions">

            <button className="btn-primary">
              Editar datos
            </button>

            <button className="btn-secondary">
              Solicitar ser Supervisor
            </button>

            <button
              className="btn-danger"
              onClick={() => setShowModal(true)}
            >
              Eliminar cuenta
            </button>

          </div>
        </div>

      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">

            <h2>¿Eliminar cuenta?</h2>

            <p>
              Esta acción es permanente.<br />
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
                  setShowModal(false);
                  setConfirmText("");
                }}
              >
                Cancelar
              </button>

              <button
                className="btn-danger"
                disabled={confirmText !== "DELETE"}
                onClick={eliminarCuenta}
              >
                Eliminar definitivamente
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}