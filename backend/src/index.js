import express from 'express';
import cors from 'cors';
import itemsRouter from './routes/items.js';
import './db/init.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
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
