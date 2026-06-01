import express from 'express';
import cors from 'cors';
import itemsRouter from './routes/items.js';
import './db/init.js';

const app = express();
const PORT = process.env.PORT || 3000;
const normalizarOrigin = (origin) => origin.replace(/\/$/, '');
const ORIGENES_PERMITIDOS = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => normalizarOrigin(origin.trim()))
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || ORIGENES_PERMITIDOS.includes(normalizarOrigin(origin))) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origen no permitido por CORS: ${origin}`));
    },
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/items', itemsRouter);

app.listen(PORT, () => {
  console.log(`Backend en http://localhost:${PORT}`);
});
