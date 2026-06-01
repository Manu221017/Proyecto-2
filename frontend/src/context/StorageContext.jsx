import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useFetch } from '../hooks/useFetch.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import {
  API_URL_STORAGE_KEY,
  DEFAULT_API_BASE,
  construirItemsEndpoint,
  normalizarApiBase,
} from '../services/apiItems.js';
import { ADAPTADORES, MODO_STORAGE_KEY } from '../services/storageAdapters.js';

const StorageContext = createContext(null);

export function StorageProvider({ children }) {
  const [modo, setModo] = useLocalStorage(MODO_STORAGE_KEY, 'local');
  const [apiBaseUrl, setApiBaseUrlState] = useLocalStorage(
    API_URL_STORAGE_KEY,
    DEFAULT_API_BASE
  );
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const { ejecutar: fetchItems, abortar: abortarFetchItems } = useFetch(null, {
    initialData: [],
    immediate: false,
  });

  const modoActivo = ADAPTADORES[modo] ? modo : 'local';
  const apiBaseUrlNormalizada = normalizarApiBase(apiBaseUrl);
  const adaptador = ADAPTADORES[modoActivo] ?? ADAPTADORES.local;

  const setApiBaseUrl = useCallback(
    (url) => {
      setApiBaseUrlState(normalizarApiBase(url));
    },
    [setApiBaseUrlState]
  );

  const obtenerItems = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const data =
        modoActivo === 'api'
          ? await fetchItems(construirItemsEndpoint(apiBaseUrlNormalizada))
          : await adaptador.obtenerItems();
      const lista = Array.isArray(data) ? data : [];
      setItems(lista);
      return lista;
    } catch (err) {
      if (err.name === 'AbortError') {
        return [];
      }
      setError(err.message || 'Error al cargar items');
      setItems([]);
      return [];
    } finally {
      setCargando(false);
    }
  }, [adaptador, apiBaseUrlNormalizada, fetchItems, modoActivo]);

  const guardarItem = useCallback(
    async (item) => {
      setError(null);
      const idsExistentes = new Set(items.map((i) => i.id));
      try {
        const guardado = await adaptador.guardarItem(
          item,
          idsExistentes,
          apiBaseUrlNormalizada
        );
        await obtenerItems();
        return guardado;
      } catch (err) {
        setError(err.message || 'Error al guardar');
        throw err;
      }
    },
    [adaptador, apiBaseUrlNormalizada, items, obtenerItems]
  );

  const eliminarItem = useCallback(
    async (id) => {
      setError(null);
      try {
        await adaptador.eliminarItem(id, apiBaseUrlNormalizada);
        await obtenerItems();
      } catch (err) {
        setError(err.message || 'Error al archivar');
        throw err;
      }
    },
    [adaptador, apiBaseUrlNormalizada, obtenerItems]
  );

  const registrarActividad = useCallback(
    async (id, registro) => {
      setError(null);
      try {
        const guardado = await adaptador.registrarActividad(
          id,
          registro,
          apiBaseUrlNormalizada
        );
        await obtenerItems();
        return guardado;
      } catch (err) {
        setError(err.message || 'Error al registrar actividad');
        throw err;
      }
    },
    [adaptador, apiBaseUrlNormalizada, obtenerItems]
  );

  useEffect(() => {
    obtenerItems();
    return () => {
      if (modoActivo === 'api') {
        abortarFetchItems();
      }
    };
  }, [abortarFetchItems, modoActivo, obtenerItems]);

  const value = useMemo(
    () => ({
      modo: modoActivo,
      setModo,
      apiBaseUrl: apiBaseUrlNormalizada,
      setApiBaseUrl,
      items,
      cargando,
      error,
      obtenerItems,
      guardarItem,
      eliminarItem,
      registrarActividad,
    }),
    [
      modoActivo,
      setModo,
      apiBaseUrlNormalizada,
      setApiBaseUrl,
      items,
      cargando,
      error,
      obtenerItems,
      guardarItem,
      eliminarItem,
      registrarActividad,
    ]
  );

  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>;
}

export function useStorage() {
  const ctx = useContext(StorageContext);
  if (!ctx) {
    throw new Error('useStorage debe usarse dentro de StorageProvider');
  }
  return ctx;
}
