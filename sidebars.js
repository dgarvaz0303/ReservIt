// @ts-check

const sidebars = {
  tutorialSidebar: [
    "intro",
    {
      type: "category",
      label: "Proyecto",
      items: [
        "proyecto/documentacion-tecnica",
        "proyecto/vision-general",
        "proyecto/arquitectura",
        "proyecto/estructura",
        "proyecto/configuracion",
        "proyecto/usuarios-prueba",
      ],
    },
    {
      type: "category",
      label: "Backend",
      items: [
        "backend/overview",
        "backend/autenticacion",
        "backend/modelos",
        "backend/api",
      ],
    },
    {
      type: "category",
      label: "Frontend",
      items: [
        "frontend/web",
        "frontend/mobile",
      ],
    },
    {
      type: "category",
      label: "Mantenimiento",
      items: [
        "mantenimiento/backend",
        "mantenimiento/frontend",
        "mantenimiento/flujos",
        "mantenimiento/incidencias",
      ],
    },
    {
      type: "category",
      label: "Operacion",
      items: [
        "operacion/desarrollo-local",
        "operacion/despliegue",
        "operacion/checklist",
      ],
    },
  ],
};

module.exports = sidebars;
