import { Router } from 'express';
import { randomUUID } from 'crypto';
import { db } from '../db/init.js';

const router = Router();

function rowToItem(row) {
  if (!row) return null;
  return {
    ...row,
    puntuacion: row.puntuacion ?? null,
    activo: Boolean(row.activo),
    atributos: row.atributos ? JSON.parse(row.atributos) : {},
  };
}

router.get('/', (_req, res) => {
  const rows = db
    .prepare('SELECT * FROM items WHERE activo = 1 ORDER BY fechaActividad DESC')
    .all();
  res.json(rows.map(rowToItem));
});

router.post('/', (req, res) => {
  const body = req.body;
  const now = new Date().toISOString();
  const item = {
    id: body.id || randomUUID(),
    nombre: body.nombre,
    categoriaId: body.categoriaId ?? '',
    estado: body.estado ?? 'pendiente',
    puntuacion: body.puntuacion ?? null,
    fechaRegistro: body.fechaRegistro ?? now,
    fechaActividad: body.fechaActividad ?? now,
    notas: body.notas ?? '',
    atributos: JSON.stringify(body.atributos ?? {}),
    activo: 1,
  };

  if (!item.nombre) {
    return res.status(400).json({ error: 'nombre es obligatorio' });
  }

  db.prepare(`
    INSERT INTO items (id, nombre, categoriaId, estado, puntuacion, fechaRegistro, fechaActividad, notas, atributos, activo)
    VALUES (@id, @nombre, @categoriaId, @estado, @puntuacion, @fechaRegistro, @fechaActividad, @notas, @atributos, @activo)
  `).run(item);

  res.status(201).json(rowToItem(item));
});

router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Item no encontrado' });
  }

  const body = req.body;
  const updated = {
    id: req.params.id,
    nombre: body.nombre ?? existing.nombre,
    categoriaId: body.categoriaId ?? existing.categoriaId,
    estado: body.estado ?? existing.estado,
    puntuacion: body.puntuacion !== undefined ? body.puntuacion : existing.puntuacion,
    fechaRegistro: body.fechaRegistro ?? existing.fechaRegistro,
    fechaActividad: body.fechaActividad ?? new Date().toISOString(),
    notas: body.notas ?? existing.notas,
    atributos: JSON.stringify(
      body.atributos !== undefined ? body.atributos : JSON.parse(existing.atributos || '{}')
    ),
    activo: body.activo !== undefined ? (body.activo ? 1 : 0) : existing.activo,
  };

  db.prepare(`
    UPDATE items SET
      nombre = @nombre,
      categoriaId = @categoriaId,
      estado = @estado,
      puntuacion = @puntuacion,
      fechaRegistro = @fechaRegistro,
      fechaActividad = @fechaActividad,
      notas = @notas,
      atributos = @atributos,
      activo = @activo
    WHERE id = @id
  `).run(updated);

  res.json(rowToItem(updated));
});

router.delete('/:id', (req, res) => {
  const result = db
    .prepare('UPDATE items SET activo = 0, fechaActividad = ? WHERE id = ? AND activo = 1')
    .run(new Date().toISOString(), req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Item no encontrado o ya archivado' });
  }

  res.json({ message: 'Item archivado', id: req.params.id });
});

router.post('/:id/registro', (req, res) => {
  const item = db.prepare('SELECT id FROM items WHERE id = ? AND activo = 1').get(req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Item no encontrado' });
  }

  const registro = {
    id: randomUUID(),
    itemId: req.params.id,
    fecha: req.body.fecha ?? new Date().toISOString(),
    valor: req.body.valor ?? null,
    notas: req.body.notas ?? '',
  };

  db.prepare(`
    INSERT INTO registros (id, itemId, fecha, valor, notas)
    VALUES (@id, @itemId, @fecha, @valor, @notas)
  `).run(registro);

  db.prepare('UPDATE items SET fechaActividad = ? WHERE id = ?').run(registro.fecha, req.params.id);

  res.status(201).json(registro);
});

export default router;
