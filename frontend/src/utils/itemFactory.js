export function crearItemVacio() {
  const ahora = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    nombre: '',
    categoriaId: 'rpg',
    estado: 'pendiente',
    puntuacion: null,
    fechaRegistro: ahora,
    fechaActividad: ahora,
    notas: '',
    atributos: {},
    activo: true,
  };
}

export function crearItemDesdeFormulario(form) {
  const ahora = new Date().toISOString();
  return {
    id: form.id || crypto.randomUUID(),
    nombre: form.nombre.trim(),
    categoriaId: form.categoriaId,
    estado: form.estado,
    puntuacion: form.puntuacion === '' ? null : Number(form.puntuacion),
    fechaRegistro: form.fechaRegistro || ahora,
    fechaActividad: ahora,
    notas: form.notas.trim(),
    atributos: parseAtributos(form.atributosTexto),
    activo: true,
  };
}

function parseAtributos(texto) {
  if (!texto.trim()) return {};
  try {
    return JSON.parse(texto);
  } catch {
    return { descripcion: texto.trim() };
  }
}

export function itemAFormulario(item) {
  return {
    id: item.id,
    nombre: item.nombre,
    categoriaId: item.categoriaId,
    estado: item.estado,
    puntuacion: item.puntuacion ?? '',
    fechaRegistro: item.fechaRegistro,
    notas: item.notas,
    atributosTexto: JSON.stringify(item.atributos ?? {}, null, 2),
  };
}
