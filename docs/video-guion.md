# Guion de video - Fase 4

Duracion objetivo: 5 a 7 minutos.

## 0:00 - 0:40 Intro

- Presentarme: Karen, Proyecto 2 de Sistemas y Tecnologias Web.
- Explicar el objetivo: app full stack para metas personales con frontend en Vercel y backend en Render.
- Mencionar el stack: React, Vite, Express, SQLite, Recharts.

## 0:40 - 2:00 Demo En Vercel

- Abrir la URL de Vercel.
- Mostrar tres items reales.
- Cambiar filtros por texto, categoria y estado.
- Alternar tema con el boton o la tecla `T`.
- Cambiar a modo API y confirmar que se comunica con Render.
- Crear o actualizar una meta y mostrar que las graficas cambian.

## 2:00 - 3:40 Recorrido De Codigo

- Mostrar `frontend/src/hooks/`.
- Explicar `useLocalStorage`: persiste tema y modo de almacenamiento.
- Explicar `useFetch`: usa `AbortController` para cancelar requests anteriores o desmontados.
- Explicar `useAtajoTeclado`: centraliza tecla `T` y `Escape`.
- Explicar `useProgreso`: calcula estadisticas y datos de graficas.
- Mostrar `backend/src/index.js` y la configuracion CORS con `FRONTEND_URL`.

## 3:40 - 5:20 Defensa Tecnica

- Decision a defender: separar adaptadores de almacenamiento y hooks de UI/datos.
- Beneficio: los componentes no saben si los datos vienen de LocalStorage o API.
- Beneficio: `useFetch` evita actualizar estado con respuestas viejas cuando cambia el modo o se desmonta el componente.
- Beneficio: `useProgreso` deja `App` mas declarativo y reutilizable.
- Mencionar Profiler: `useMemo`, `useCallback` y `React.memo` reducen renders innecesarios.

## 5:20 - 6:30 Cierre

- Reflexion: aprendi a conectar frontend, backend, deploy y rendimiento como un flujo completo.
- Mencionar mejoras futuras: autenticacion, historial completo de actividad y pruebas automatizadas.
- Cerrar mostrando las URLs finales y el README.
