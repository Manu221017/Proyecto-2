# STW Fase 1 — useState · useEffect · Backend

Proyecto independiente para **Sistemas y Tecnologías Web** (UVG).  
Frontend con CRUD en LocalStorage y backend Express con SQLite (sin conexión entre ambos hasta Fase 2).

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
