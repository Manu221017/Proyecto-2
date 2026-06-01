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

function esOrigenPermitido(origin) {
  if (!origin) return true;
  const originNormalizado = normalizarOrigin(origin);
  if (ORIGENES_PERMITIDOS.includes(originNormalizado)) return true;

  try {
    return new URL(originNormalizado).hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
}

app.use(
  cors({
    origin(origin, callback) {
      if (esOrigenPermitido(origin)) {
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
