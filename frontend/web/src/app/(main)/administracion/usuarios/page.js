"use client";

import { useEffect, useState } from "react";
import "@/styles/usuarios.css";

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtros, setFiltros] = useState({
    nombre: "",
    email: "",
    usuario: "",
  });

  const [sort, setSort] = useState({ campo: "", asc: true });

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    const res = await fetch("http://localhost:8000/api/usuarios");
    const data = await res.json();
    setUsuarios(Array.isArray(data) ? data : data.data || []);
  };

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar usuario?")) return;

    await fetch(`http://localhost:8000/api/usuarios/${id}`, {
      method: "DELETE",
    });

    fetchUsuarios();
  };

  const cambiarRol = async (id) => {
    await fetch(`http://localhost:8000/api/usuarios/${id}/rol`, {
      method: "PUT",
    });

    fetchUsuarios();
  };

  // 🔍 FILTRO
  const filtrados = usuarios.filter((u) =>
    u.nombre.toLowerCase().includes(filtros.nombre.toLowerCase()) &&
    u.email.toLowerCase().includes(filtros.email.toLowerCase()) &&
    u.nombre_user.toLowerCase().includes(filtros.usuario.toLowerCase())
  );

  // 🔃 ORDEN
  const ordenados = [...filtrados].sort((a, b) => {
    if (!sort.campo) return 0;

    const valA = a[sort.campo];
    const valB = b[sort.campo];

    if (valA < valB) return sort.asc ? -1 : 1;
    if (valA > valB) return sort.asc ? 1 : -1;
    return 0;
  });

  const handleSort = (campo) => {
    setSort((prev) => ({
      campo,
      asc: prev.campo === campo ? !prev.asc : true,
    }));
  };

  return (
    <div className="admin-page">

      <h1 className="title">Usuarios</h1>

      {/* FILTROS */}
      <div className="filters-card">

        <div className="filters-grid">
            <input
                placeholder="Nombre"
                value={filtros.nombre}
                onChange={(e) =>
                    setFiltros({ ...filtros, nombre: e.target.value })
                }
            />

            <input
                placeholder="Email"
                value={filtros.email}
                onChange={(e) =>
                    setFiltros({ ...filtros, email: e.target.value })
                }
            />

            <input
                placeholder="Usuario"
                value={filtros.usuario}
                onChange={(e) =>
                    setFiltros({ ...filtros, usuario: e.target.value })
                }
            />
        </div>

        <button
            className="btn-clear"
            onClick={() =>
            setFiltros({ nombre: "", email: "", usuario: "" })
            }
        >
            Limpiar filtros
        </button>

    </div>

      {/* TABLA */}
      <div className="table">

        {/* HEADER */}
        <div className="table-header">

          <span onClick={() => handleSort("nombre")}>Nombre</span>
          <span onClick={() => handleSort("nombre_user")}>Usuario</span>
          <span onClick={() => handleSort("email")}>Email</span>
          <span onClick={() => handleSort("telefono")}>Teléfono</span>
          <span onClick={() => handleSort("rol")}>Rol</span>
          <span>Acciones</span>

        </div>

        {/* FILAS */}
        {ordenados.map((u) => (
          <div key={u.id} className="table-row">

            <span>{u.nombre}</span>
            <span>@{u.nombre_user}</span>
            <span>{u.email}</span>
            <span>{u.telefono}</span>

            <span className={`badge ${u.roll}`}>
              {u.roll}
            </span>

            <div className="actions">
              <button onClick={() => cambiarRol(u.id)}>
                Cambiar Rol
              </button>

              <button
                className="delete"
                onClick={() => eliminar(u.id)}
              >
                Eliminar
              </button>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}