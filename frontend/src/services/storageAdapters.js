import { STORAGE_KEY } from '../utils/constants.js';
import { cargarItems, guardarItems } from './storage.js';
import {
  obtenerItemsApi,
  crearItemApi,
  actualizarItemApi,
  archivarItemApi,
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
};

export const adaptadorApi = {
  async obtenerItems() {
    return obtenerItemsApi();
  },

  async guardarItem(item, idsExistentes) {
    const payload = {
      ...item,
      fechaActividad: new Date().toISOString(),
    };
    if (idsExistentes.has(item.id)) {
      return actualizarItemApi(payload);
    }
    return crearItemApi(payload);
  },

  async eliminarItem(id) {
    return archivarItemApi(id);
  },
};

export const ADAPTADORES = {
  local: adaptadorLocal,
  api: adaptadorApi,
};

export const MODO_STORAGE_KEY = 'storageModo';
