# STW Proyecto-2 — Sistemas y Tecnologías Web (UVG)

Repositorio: https://github.com/Manu221017/Proyecto-2

| Rama | Contenido |
|------|-----------|
| `main` | Fase 1 — useState, useEffect, LocalStorage + API Express (independientes) |
| `fase-2` | Fase 2 — StorageContext, ThemeContext, useRef, categorías |

## Fase 2 (rama `fase-2`)

- **StorageContext:** `modo`, `setModo`, `obtenerItems()`, `guardarItem()`, `eliminarItem()` — alterna LocalStorage / API sin `if(modo)` en componentes.
- **ThemeContext:** tema claro/oscuro con variables CSS, persiste en localStorage, atajo **T**.
- **useRef:** foco en nombre tras crear; scroll automático horizontal en la lista.
- **Categorías:** `frontend/src/utils/categorias.js` (6 categorías con emoji y color).

```bash
git checkout fase-2
npm install          # solo la primera vez (raíz + concurrently)
npm run install:all  # dependencias de frontend y backend
npm run dev          # solo frontend → http://localhost:5173
npm run dev:all      # frontend + backend a la vez (modo API)
```

## Docker

Requisito: [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y en ejecución.

Copia variables de entorno (opcional):

```bash
copy .env.example .env
```

### Desarrollo (hot reload)

```bash
npm run docker:dev
```

- Frontend: http://localhost:5173  
- Backend: http://localhost:3000  
- En la app, elige modo **API** para usar el backend del contenedor.

### Producción (build + nginx)

```bash
npm run docker:up
```

Mismos puertos. La base SQLite se guarda en el volumen `sqlite-data`.

### Detener

```bash
npm run docker:down
# o desarrollo:
npm run docker:dev:down
```

> **Importante:** `VITE_API_URL` debe ser `http://localhost:3000/api` porque el navegador corre en tu PC, no dentro de Docker. No uses `http://backend:3000` en el `.env`.

---

## Fase 1 (rama `main`)

Frontend con CRUD en LocalStorage y backend Express con SQLite.

## Estructura

```
stw-fase1-items/
├── frontend/     # Vite + React
└── backend/      # Express + SQLite
```

## Requisitos

- Node.js 18+

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Abre http://localhost:5173

## Backend

```bash
cd backend
npm install
npm run dev
```

API en http://localhost:3000

### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/items` | Items activos |
| POST | `/api/items` | Crear item |
| PUT | `/api/items/:id` | Actualizar |
| DELETE | `/api/items/:id` | Archivar (activo=0) |
| POST | `/api/items/:id/registro` | Registro de actividad |

Ejemplo crear item:

```bash
curl -X POST http://localhost:3000/api/items -H "Content-Type: application/json" -d "{\"nombre\":\"Leer 20 paginas\",\"categoriaId\":\"lectura\",\"estado\":\"pendiente\"}"
```

## Mis primeros Items

Tema: **metas personales** (juegos, salud, estudio).

> **Importante:** Agrega aquí una captura de pantalla con al menos 3 items **reales tuyos** (no "Test" ni "Item 1").  
> Ejemplos de datos personales que puedes registrar:
>
> - Terminar *Zelda: Tears of the Kingdom* (categoría rpg)
> - Caminar 8,000 pasos diarios (categoría salud)
> - Repasar capítulo 5 de Cálculo (categoría estudio)

![Captura de mis items](./docs/captura-items.png)

*(Crea la carpeta `docs/` y guarda tu captura antes de entregar.)*

## Git

- Mínimo 8 commits en 4+ días distintos
- `.gitignore` incluye `node_modules`, `.env`, `*.sqlite`

## Autor

Karen — UVG STW 2026
