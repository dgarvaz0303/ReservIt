import React, { useMemo, useState } from "react";

const defaultItems = [
  { id: "env-backend", label: "Variables de entorno del backend revisadas" },
  { id: "env-web", label: "Variables publicas del frontend web revisadas" },
  { id: "supabase-auth", label: "Supabase Auth operativo" },
  { id: "usuarios-table", label: "Tabla usuarios sincronizada con Auth" },
  { id: "cors", label: "CORS ajustado al entorno correspondiente" },
  { id: "roles", label: "Rutas administrativas revisadas por rol" },
  { id: "reservas", label: "Flujo de reservas probado" },
  { id: "qr", label: "Validacion de QR comprobada" },
];

export default function MaintenanceChecklist() {
  const [checked, setChecked] = useState({});

  const completed = useMemo(
    () => defaultItems.filter((item) => checked[item.id]).length,
    [checked]
  );

  const percent = Math.round((completed / defaultItems.length) * 100);

  return (
    <div className="maintenance-panel">
      <div className="maintenance-panel__header">
        <strong>Checklist interactivo de mantenimiento</strong>
        <span>{percent}% completado</span>
      </div>

      <div className="maintenance-progress" aria-hidden="true">
        <span style={{ width: `${percent}%` }} />
      </div>

      <div className="maintenance-checklist">
        {defaultItems.map((item) => (
          <label key={item.id} className="maintenance-checklist__item">
            <input
              type="checkbox"
              checked={Boolean(checked[item.id])}
              onChange={() =>
                setChecked((current) => ({
                  ...current,
                  [item.id]: !current[item.id],
                }))
              }
            />
            <span>{item.label}</span>
          </label>
        ))}
      </div>

      <button
        type="button"
        className="maintenance-button"
        onClick={() => setChecked({})}
      >
        Reiniciar checklist
      </button>
    </div>
  );
}
