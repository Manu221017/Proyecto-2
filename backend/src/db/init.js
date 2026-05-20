import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../../data/items.db');

export const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    categoriaId TEXT,
    estado TEXT,
    puntuacion REAL,
    fechaRegistro TEXT,
    fechaActividad TEXT,
    notas TEXT,
    atributos TEXT,
    activo INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS registros (
    id TEXT PRIMARY KEY,
    itemId TEXT NOT NULL,
    fecha TEXT,
    valor REAL,
    notas TEXT,
    FOREIGN KEY (itemId) REFERENCES items(id)
  );
`);
