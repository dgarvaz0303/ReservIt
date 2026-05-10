import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/',
    component: ComponentCreator('/', '953'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', 'b2f'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', 'b41'),
            routes: [
              {
                path: '/backend/api',
                component: ComponentCreator('/backend/api', '8e3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/backend/autenticacion',
                component: ComponentCreator('/backend/autenticacion', '585'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/backend/modelos',
                component: ComponentCreator('/backend/modelos', 'b4b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/backend/overview',
                component: ComponentCreator('/backend/overview', '423'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/frontend/mobile',
                component: ComponentCreator('/frontend/mobile', 'af3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/frontend/web',
                component: ComponentCreator('/frontend/web', 'ef0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/mantenimiento/backend',
                component: ComponentCreator('/mantenimiento/backend', 'a4f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/mantenimiento/flujos',
                component: ComponentCreator('/mantenimiento/flujos', '581'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/mantenimiento/frontend',
                component: ComponentCreator('/mantenimiento/frontend', 'cf3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/mantenimiento/incidencias',
                component: ComponentCreator('/mantenimiento/incidencias', '502'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/operacion/checklist',
                component: ComponentCreator('/operacion/checklist', '187'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/operacion/desarrollo-local',
                component: ComponentCreator('/operacion/desarrollo-local', '3b6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/operacion/despliegue',
                component: ComponentCreator('/operacion/despliegue', '742'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/proyecto/arquitectura',
                component: ComponentCreator('/proyecto/arquitectura', '1da'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/proyecto/configuracion',
                component: ComponentCreator('/proyecto/configuracion', 'd71'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/proyecto/documentacion-tecnica',
                component: ComponentCreator('/proyecto/documentacion-tecnica', 'dfb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/proyecto/estructura',
                component: ComponentCreator('/proyecto/estructura', '753'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/proyecto/usuarios-prueba',
                component: ComponentCreator('/proyecto/usuarios-prueba', '75a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/proyecto/vision-general',
                component: ComponentCreator('/proyecto/vision-general', '1fe'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/',
                component: ComponentCreator('/', 'fc9'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
