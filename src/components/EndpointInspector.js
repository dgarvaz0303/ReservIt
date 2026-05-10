import React, { useState } from "react";

const endpoints = [
  {
    id: "login",
    label: "Login",
    method: "POST",
    path: "/api/login",
    file: "backend/app/routes/auth/login.py",
    responsibility:
      "Valida credenciales con Supabase Auth y recupera el perfil interno desde la tabla usuarios.",
    maintenance:
      "Si falla, revisar Supabase Auth, la tabla usuarios y la correspondencia entre auth_id y usuario.",
  },
  {
    id: "create-reserva",
    label: "Crear reserva",
    method: "POST",
    path: "/api/reservas",
    file: "backend/app/routes/reservas/reservas.py",
    responsibility:
      "Valida token, evita reservas duplicadas, calcula disponibilidad y genera el qr_token.",
    maintenance:
      "Si rechaza reservas validas, revisar zonas, capacidad, reservas existentes y formato de hora.",
  },
  {
    id: "availability",
    label: "Disponibilidad",
    method: "GET",
    path: "/api/disponibilidad",
    file: "backend/app/routes/reservas/disponibilidad.py",
    responsibility:
      "Cruza zonas, horarios y reservas existentes para calcular plazas disponibles por franja.",
    maintenance:
      "Si devuelve vacio, comprobar que el establecimiento tenga zonas y horarios asociados.",
  },
  {
    id: "qr",
    label: "Validar QR",
    method: "POST",
    path: "/api/reservas/usar/{qr_token}",
    file: "backend/app/routes/reservas/reservas.py",
    responsibility:
      "Busca la reserva por token, comprueba que no se haya usado y marca la entrada como validada.",
    maintenance:
      "Si devuelve QR no valido, comprobar token, estado qr_usado y que la peticion sea POST.",
  },
];

export default function EndpointInspector() {
  const [selectedId, setSelectedId] = useState(endpoints[0].id);
  const selected = endpoints.find((endpoint) => endpoint.id === selectedId);

  return (
    <div className="endpoint-inspector">
      <div className="endpoint-inspector__tabs" role="tablist">
        {endpoints.map((endpoint) => (
          <button
            key={endpoint.id}
            type="button"
            className={endpoint.id === selectedId ? "is-active" : ""}
            onClick={() => setSelectedId(endpoint.id)}
          >
            {endpoint.label}
          </button>
        ))}
      </div>

      <div className="endpoint-inspector__body">
        <p className="endpoint-inspector__route">
          <strong>{selected.method}</strong> <code>{selected.path}</code>
        </p>
        <p>
          <strong>Archivo:</strong> <code>{selected.file}</code>
        </p>
        <p>
          <strong>Responsabilidad:</strong> {selected.responsibility}
        </p>
        <p>
          <strong>Mantenimiento:</strong> {selected.maintenance}
        </p>
      </div>
    </div>
  );
}
