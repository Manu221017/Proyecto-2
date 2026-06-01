export const API_URL_STORAGE_KEY = 'apiBaseUrl';
export const DEFAULT_API_BASE =
  import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3000/api');

export function normalizarApiBase(apiBase) {
  return String(apiBase ?? '').trim().replace(/\/+$/, '');
}

export function resolverApiBase(apiBase = DEFAULT_API_BASE) {
  const url = normalizarApiBase(apiBase);

  if (!url) {
    throw new Error('Configura la URL del backend de Render para usar el modo API.');
  }

  return url;
}

export function construirItemsEndpoint(apiBase) {
  return `${resolverApiBase(apiBase)}/items`;
}

async function parseError(res) {
  const data = await res.json().catch(() => ({}));
  throw new Error(data.error || `Error HTTP ${res.status}`);
}

export async function obtenerItemsApi(apiBase, init = {}) {
  const res = await fetch(construirItemsEndpoint(apiBase), init);
  if (!res.ok) await parseError(res);
  return res.json();
}

export async function crearItemApi(item, apiBase) {
  const res = await fetch(construirItemsEndpoint(apiBase), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) await parseError(res);
  return res.json();
}

export async function actualizarItemApi(item, apiBase) {
  const res = await fetch(`${resolverApiBase(apiBase)}/items/${item.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) await parseError(res);
  return res.json();
}

export async function archivarItemApi(id, apiBase) {
  const res = await fetch(`${resolverApiBase(apiBase)}/items/${id}`, { method: 'DELETE' });
  if (!res.ok) await parseError(res);
  return res.json();
}

export async function registrarActividadApi(id, registro, apiBase) {
  const res = await fetch(`${resolverApiBase(apiBase)}/items/${id}/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registro),
  });
  if (!res.ok) await parseError(res);
  return res.json();
}
