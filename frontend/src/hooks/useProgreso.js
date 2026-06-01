import { useMemo } from 'react';
import { CATEGORIAS } from '../utils/categorias.js';

function claveDia(fecha) {
  return `${fecha.getFullYear()}-${fecha.getMonth() + 1}-${fecha.getDate()}`;
}

function calcularEstadisticas(items) {
  const total = items.length;
  const completadas = items.filter((item) => item.estado === 'completado').length;
  const conPuntuacion = items.filter((item) => item.puntuacion != null);
  const promedio =
    conPuntuacion.length === 0
      ? 0
      : conPuntuacion.reduce((acc, item) => acc + Number(item.puntuacion), 0) /
        conPuntuacion.length;

  return {
    total,
    completadas,
    promedioPuntuacion: promedio.toFixed(1),
    porcentajeCompletado: total === 0 ? 0 : Math.round((completadas / total) * 100),
  };
}

function construirDatosGraficas(items, actividad) {
  const hoy = new Date();
  const dias = Array.from({ length: 7 }, (_, index) => {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() - (6 - index));
    return {
      key: claveDia(fecha),
      dia: `${fecha.getDate()}/${fecha.getMonth() + 1}`,
      actividad: 0,
    };
  });

  const diasPorKey = new Map(dias.map((dia) => [dia.key, dia]));
  const eventosUnicos = new Map();

  items.forEach((item) => {
    if (item.fechaActividad) {
      eventosUnicos.set(`${item.id}-${item.fechaActividad}`, item.fechaActividad);
    }
  });

  actividad.forEach((registro) => {
    eventosUnicos.set(`${registro.itemId}-${registro.fecha}`, registro.fecha);
  });

  eventosUnicos.forEach((fechaEvento) => {
    const fecha = new Date(fechaEvento);
    if (Number.isNaN(fecha.getTime())) return;
    const dia = diasPorKey.get(claveDia(fecha));
    if (dia) dia.actividad += 1;
  });

  const distribucionCategorias = CATEGORIAS.map((categoria) => {
    const total = items.filter((item) => item.categoriaId === categoria.id).length;
    return {
      name: categoria.nombre,
      value: total,
      color: categoria.color,
    };
  }).filter((categoria) => categoria.value > 0);

  const radarCategorias = CATEGORIAS.map((categoria) => {
    const metas = items.filter((item) => item.categoriaId === categoria.id);
    if (metas.length === 0) return null;

    const completadas = metas.filter((item) => item.estado === 'completado').length;
    const conPuntuacion = metas.filter((item) => item.puntuacion != null);
    const promedio =
      conPuntuacion.length === 0
        ? 0
        : conPuntuacion.reduce((acc, item) => acc + Number(item.puntuacion), 0) /
          conPuntuacion.length;
    const avance = completadas / metas.length;
    const volumen = Math.min(metas.length, 5) / 5;
    const indice = Math.round(avance * 55 + promedio * 3.5 + volumen * 10);

    return {
      categoria: categoria.nombre,
      indice: Math.min(indice, 100),
    };
  }).filter(Boolean);

  return {
    actividad7Dias: dias,
    distribucionCategorias,
    radarCategorias,
  };
}

export function useProgreso({ items, itemsVisibles, actividad }) {
  const estadisticas = useMemo(
    () => calcularEstadisticas(itemsVisibles),
    [itemsVisibles]
  );

  const datosGraficas = useMemo(
    () => construirDatosGraficas(items, actividad),
    [items, actividad]
  );

  return {
    estadisticas,
    datosGraficas,
  };
}
