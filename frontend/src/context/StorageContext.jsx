import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ADAPTADORES, MODO_STORAGE_KEY } from '../services/storageAdapters.js';

const StorageContext = createContext(null);

export function StorageProvider({ children }) {
  const [modo, setModoState] = useState(
    () => localStorage.getItem(MODO_STORAGE_KEY) || 'local'
  );
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const adaptador = ADAPTADORES[modo] ?? ADAPTADORES.local;

  const setModo = useCallback((nuevoModo) => {
    setModoState(nuevoModo);
    localStorage.setItem(MODO_STORAGE_KEY, nuevoModo);
  }, []);

  const obtenerItems = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await adaptador.obtenerItems();
      setItems(data);
      return data;
    } catch (err) {
      setError(err.message || 'Error al cargar items');
      setItems([]);
      return [];
    } finally {
      setCargando(false);
    }
  }, [adaptador]);

  const guardarItem = useCallback(
    async (item) => {
      setError(null);
      const idsExistentes = new Set(items.map((i) => i.id));
      try {
        await adaptador.guardarItem(item, idsExistentes);
        await obtenerItems();
      } catch (err) {
        setError(err.message || 'Error al guardar');
        throw err;
      }
    },
    [adaptador, items, obtenerItems]
  );

  const eliminarItem = useCallback(
    async (id) => {
      setError(null);
      try {
        await adaptador.eliminarItem(id);
        await obtenerItems();
      } catch (err) {
        setError(err.message || 'Error al archivar');
        throw err;
      }
    },
    [adaptador, obtenerItems]
  );

  useEffect(() => {
    obtenerItems();
  }, [obtenerItems]);

  const value = useMemo(
    () => ({
      modo,
      setModo,
      items,
      cargando,
      error,
      obtenerItems,
      guardarItem,
      eliminarItem,
    }),
    [modo, setModo, items, cargando, error, obtenerItems, guardarItem, eliminarItem]
  );

  return (
    <StorageContext.Provider value={value}>{children}</StorageContext.Provider>
  );
}

export function useStorage() {
  const ctx = useContext(StorageContext);
  if (!ctx) {
    throw new Error('useStorage debe usarse dentro de StorageProvider');
  }
  return ctx;
}
