import { STORAGE_KEY } from '../utils/constants.js';
import { cargarItems, guardarItems } from './storage.js';
import {
  obtenerItemsApi,
  crearItemApi,
  actualizarItemApi,
  archivarItemApi,
  registrarActividadApi,
} from './apiItems.js';

function soloActivos(lista) {
  return lista.filter((i) => i.activo !== false);
}

export const adaptadorLocal = {
  async obtenerItems() {
    return soloActivos(cargarItems());
  },

  async guardarItem(item, idsExistentes) {
    const todos = cargarItems();
    const actualizado = {
      ...item,
      activo: true,
      fechaActividad: new Date().toISOString(),
    };
    const existe = idsExistentes.has(item.id);
    const lista = existe
      ? todos.map((i) => (i.id === item.id ? { ...i, ...actualizado } : i))
      : [...todos, actualizado];
    guardarItems(lista);
    return actualizado;
  },

  async eliminarItem(id) {
    const todos = cargarItems();
    guardarItems(
      todos.map((i) =>
        i.id === id
          ? { ...i, activo: false, fechaActividad: new Date().toISOString() }
          : i
      )
    );
  },

  async registrarActividad(id, registro) {
    const fecha = registro.fecha ?? new Date().toISOString();
    const todos = cargarItems();
    guardarItems(
      todos.map((i) =>
        i.id === id
          ? {
              ...i,
              fechaActividad: fecha,
              puntuacion: registro.valor ?? i.puntuacion,
            }
          : i
      )
    );

    return {
      id: crypto.randomUUID(),
      itemId: id,
      fecha,
      valor: registro.valor ?? null,
      notas: registro.notas ?? '',
    };
  },
};

export const adaptadorApi = {
  async obtenerItems(apiBase) {
    return obtenerItemsApi(apiBase);
  },

  async guardarItem(item, idsExistentes, apiBase) {
    const payload = {
      ...item,
      fechaActividad: new Date().toISOString(),
    };
    if (idsExistentes.has(item.id)) {
      return actualizarItemApi(payload, apiBase);
    }
    return crearItemApi(payload, apiBase);
  },

  async eliminarItem(id, apiBase) {
    return archivarItemApi(id, apiBase);
  },

  async registrarActividad(id, registro, apiBase) {
    return registrarActividadApi(id, registro, apiBase);
  },
};

export const ADAPTADORES = {
  local: adaptadorLocal,
  api: adaptadorApi,
};

export const MODO_STORAGE_KEY = 'storageModo';
