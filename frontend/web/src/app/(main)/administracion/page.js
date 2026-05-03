"use client";

import { useRouter } from "next/navigation";
import "@/styles/admin.css";

export default function AdminPanel() {
  const router = useRouter();

  return (
    <div className="admin-page">
      <h1 className="admin-title">Panel de administración</h1>

      <div className="admin-grid">

        <div
          className="admin-card"
          onClick={() => router.push("/administracion/usuarios")}
        >
          <h2>👤 Usuarios</h2>
          <p>Gestionar usuarios y roles</p>
        </div>

        <div
          className="admin-card"
          onClick={() => router.push("/administracion/locales")}
        >
          <h2>🏪 Locales</h2>
          <p>Gestionar establecimientos</p>
        </div>

      </div>
    </div>
  );
}