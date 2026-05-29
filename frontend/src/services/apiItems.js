const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function parseError(res) {
  const data = await res.json().catch(() => ({}));
  throw new Error(data.error || `Error HTTP ${res.status}`);
}

export async function obtenerItemsApi() {
  const res = await fetch(`${API_BASE}/items`);
  if (!res.ok) await parseError(res);
  return res.json();
}

export async function crearItemApi(item) {
  const res = await fetch(`${API_BASE}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) await parseError(res);
  return res.json();
}

export async function actualizarItemApi(item) {
  const res = await fetch(`${API_BASE}/items/${item.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) await parseError(res);
  return res.json();
}

export async function archivarItemApi(id) {
  const res = await fetch(`${API_BASE}/items/${id}`, { method: 'DELETE' });
  if (!res.ok) await parseError(res);
  return res.json();
}

export async function registrarActividadApi(id, registro) {
  const res = await fetch(`${API_BASE}/items/${id}/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registro),
  });
  if (!res.ok) await parseError(res);
  return res.json();
}
