# Proyecto 2 - Mis metas personales

Aplicacion full stack para registrar metas personales, medir avance, alternar entre LocalStorage y API Express, visualizar graficas y defender decisiones tecnicas con hooks reutilizables.

## 1. URLs y Deploy

| Recurso | URL |
|---|---|
| Repositorio | https://github.com/Manu221017/Proyecto-2 |
| Frontend Vercel | Pendiente: `https://TU-FRONTEND.vercel.app` |
| Backend Render | Pendiente: `https://TU-BACKEND.onrender.com` |
| Health check | Pendiente: `https://TU-BACKEND.onrender.com/api/health` |
| Video demo | Pendiente: agregar enlace del video final |

Variables de produccion:

- Vercel: `VITE_API_URL=https://TU-BACKEND.onrender.com/api`
- Render: `FRONTEND_URL=https://TU-FRONTEND.vercel.app`

El backend acepta el dominio configurado en `FRONTEND_URL` para CORS. Si necesitas mas de un origen, usa valores separados por coma.

Deploy sugerido:

1. En Render, crear un Web Service desde este repo usando `render.yaml`, o configurar `backend` como root, `npm install` como build y `npm start` como start.
2. Copiar la URL de Render y crear `VITE_API_URL` en Vercel con `/api` al final.
3. Publicar el frontend en Vercel usando `vercel.json`.
4. Copiar la URL final de Vercel en Render como `FRONTEND_URL` y redeployar el backend.

## 2. Screenshots

Guarda las capturas finales en `docs/screenshots/` antes de entregar.

| Evidencia | Archivo sugerido |
|---|---|
| Home en Vercel con items reales | `docs/screenshots/01-home-vercel.png` |
| Modo API activo contra Render | `docs/screenshots/02-modo-api-render.png` |
| Graficas con datos | `docs/screenshots/03-graficas.png` |
| Profiler / render optimizado | `docs/screenshots/04-profiler.png` |

![Home en Vercel](docs/screenshots/01-home-vercel.png)
![Graficas](docs/screenshots/03-graficas.png)

## 3. Stack

- Frontend: React 19, Vite 6, Recharts, Context API, hooks custom, React Profiler.
- Backend: Node.js, Express, SQLite con `better-sqlite3`, CORS y rutas REST.
- Deploy: Vercel para frontend, Render para backend.
- Infra local: Docker Compose para desarrollo y produccion local.

## 4. Setup Local

```bash
npm install
npm run install:all
npm run dev:all
```

Servicios locales:

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Health check: http://localhost:3000/api/health

Archivo `.env` local:

```env
VITE_API_URL=http://localhost:3000/api
FRONTEND_URL=http://localhost:5173
```

## 5. Items Reales

Tema de la app: seguimiento de metas personales. Para la defensa se recomiendan items reales y no datos genericos como "Test" o "Item 1".

| Meta | Categoria | Estado | Puntuacion |
|---|---|---|---|
| Terminar Zelda: Tears of the Kingdom | RPG | En progreso | 8.5 |
| Caminar 8,000 pasos diarios | Salud | En progreso | 9 |
| Repasar capitulo 5 de Calculo | Estudio | Pendiente | 7 |

## 6. Paleta

La paleta usa variables CSS para tema claro y oscuro:

| Uso | Claro | Oscuro |
|---|---|---|
| Fondo | `#eef2f7` | `#101624` |
| Superficie | `#ffffff` | `#171f2e` |
| Primario | `#2563eb` | `#60a5fa` |
| Exito | `#16a34a` | `#4ade80` |
| Peligro | `#dc2626` | `#fb7185` |

Las categorias agregan acentos propios desde `frontend/src/utils/categorias.js`.

## 7. Graficas

`DashboardGraficas` muestra tres vistas con Recharts:

- Actividad de los ultimos 7 dias con barras.
- Distribucion por categoria con dona.
- Indice de enfoque con radar.

El indice de enfoque es una metrica propia: combina avance, puntuacion promedio y volumen de metas por categoria.

## 8. Profiler

La app usa `React.Profiler` en formulario, filtros, graficas, lista y modal. En desarrollo imprime mediciones con la etiqueta `[Fase 3 Profiler]`.

Optimizaciones aplicadas:

- `useReducer` centraliza el estado de metas.
- `useMemo` evita recalcular filtros, estadisticas y datasets innecesarios.
- `useCallback` estabiliza handlers enviados a componentes hijos.
- `React.memo` reduce renders en tarjetas, lista, filtros, formulario y graficas.

Evidencia escrita: `docs/fase3-profiler.md`.

## 9. Tabla De Hooks

| Hook | Archivo | Responsabilidad | Donde se usa |
|---|---|---|---|
| `useLocalStorage` | `frontend/src/hooks/useLocalStorage.js` | Leer, escribir y sincronizar estado persistido | `ThemeContext`, `StorageContext` |
| `useFetch` | `frontend/src/hooks/useFetch.js` | Fetch reutilizable con `AbortController`, loading, error y data | `StorageContext` |
| `useAtajoTeclado` | `frontend/src/hooks/useAtajoTeclado.js` | Registrar atajos de teclado ignorando campos editables cuando aplica | `ThemeContext`, `ModalEdicion` |
| `useProgreso` | `frontend/src/hooks/useProgreso.js` | Calcular estadisticas y datasets de graficas del dominio de metas | `App` |

## 10. Sobre Mi

Karen, estudiante de Sistemas y Tecnologias Web en UVG. En este proyecto cerre el flujo completo: estado local, API, persistencia, optimizacion con Profiler, hooks reutilizables y preparacion para deploy en produccion.

Mi decision tecnica principal fue aislar la persistencia en adaptadores y hooks. Asi los componentes no dependen de si los datos vienen de LocalStorage o de Express, y el cambio de modo se mantiene en una sola frontera clara.
