"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import "@/styles/navbar.css";

export default function Navbar({ rol }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const nombre = localStorage.getItem("nombre");
    setUser(nombre || "Usuario");
  }, []);

  // cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nombre");
    localStorage.removeItem("rol");
    router.push("/login");
  };

  const linksByRole = {
    cliente: [
      { name: "Inicio", path: "/" },
      { name: "Establecimientos", path: "/establecimientos" },
      { name: "Mis reservas", path: "/reservas" },
    ],
    supervisor: [
      { name: "Inicio", path: "/" },
      { name: "Establecimientos", path: "/establecimientos" },
      { name: "Mis reservas", path: "/reservas" },
      { name: "Mis locales", path: "/locales" },
    ],
    admin: [
      { name: "Inicio", path: "/" },
      { name: "Establecimientos", path: "/establecimientos" },
      { name: "Mis reservas", path: "/reservas" },
      { name: "Administración", path: "/admin" },
    ],
  };

  const links = linksByRole[rol] || [];

  return (
    <nav className="navbar">
      <div className="container navbar-content">

        {/* LOGO */}
        <div
          className="navbar-logo"
          onClick={() => router.push("/")}
        >
          <img src="/logo.png" alt="ReservIt" className="navbar-logo-img" />
          <span>ReservIt</span>
        </div>

        {/* LINKS */}
        <div className="navbar-links">
          {links.map((link) => (
            <button
              key={link.path}
              className="navbar-link"
              onClick={() => router.push(link.path)}
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* USUARIO */}
        <div className="navbar-user" ref={dropdownRef}>
          <button
            className="navbar-link"
            onClick={() => setOpen(!open)}
          >
            {user}
          </button>

          {open && (
            <div className="navbar-dropdown">
              <button onClick={() => router.push("/perfil")}>
                Perfil
              </button>

              <button onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}