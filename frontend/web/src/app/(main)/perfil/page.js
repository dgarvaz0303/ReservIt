"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/perfil.css";

export default function PerfilPage() {
  const [user, setUser] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const router = useRouter();

  useEffect(() => {
    cargarUsuario();
    cargarHistorial();
  }, []);

  // 🔥 AHORA DESDE BACKEND
  const cargarUsuario = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8000/api/usuarios/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setUser(data);

    } catch (err) {
      console.log(err);
    }
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
    const token = localStorage.getItem("token");

    await fetch("http://localhost:8000/api/usuarios/me", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    localStorage.clear();
    window.location.href = "/login";
  };

  if (!user) return <p className="perfil-loading">Cargando...</p>;

  return (
    <div className="perfil-page">
      <div className="perfil-container">

        {/* HEADER */}
        <div className="perfil-header">
          <button
            className="btn-back"
            onClick={() => router.push("/")}
          >
            ← Inicio
          </button>

          <div>
            <h1 className="perfil-title">Mi Perfil</h1>
            <p className="perfil-subtitle">
              Gestiona tu cuenta y revisa tu actividad
            </p>
          </div>
        </div>

        {/* INFO */}
        <div className="perfil-card">
          <h2>Información personal</h2>

          <div className="perfil-grid">

            <div>
              <span>Nombre</span>
              <strong>{user.nombre}</strong>
            </div>

            <div>
              <span>Usuario</span>
              <strong>{user.nombre_user}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>{user.email}</strong>
            </div>

            <div>
              <span>Teléfono</span>
              <strong>{user.telefono}</strong>
            </div>

            <div>
              <span>Rol</span>
              <strong>{user.roll}</strong>
            </div>

          </div>
        </div>

        {/* HISTORIAL */}
        <div className="perfil-card">
          <h2>Historial de reservas</h2>

          <div className="historial-list">
            {historial.length === 0 ? (
              <p className="perfil-empty">No hay reservas pasadas</p>
            ) : (
              historial.map((r) => (
                <div key={r.id} className="historial-item">

                  <img
                    src={r.imagen_url || "/placeholder.jpg"}
                    alt={r.establecimiento_nombre}
                  />

                  <div className="historial-info">
                    <h3>{r.establecimiento_nombre}</h3>
                    <p>{r.fecha} · {r.hora}</p>
                    <span>{r.zona}</span>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>

        {/* ACCIONES */}
        <div className="perfil-card">
          <h2>Acciones</h2>

          <div className="perfil-actions">

            <button
              className="btn-primary"
              onClick={() => router.push("/perfil/editar")}
            >
              Editar datos
            </button>

            <button
              className="btn-secondary"
              onClick={() => router.push("/")}
            >
              Ir al inicio
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