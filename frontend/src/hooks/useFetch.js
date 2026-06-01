import { useCallback, useEffect, useRef, useState } from 'react';

async function leerJson(response) {
  const texto = await response.text();
  return texto ? JSON.parse(texto) : null;
}

async function lanzarErrorHttp(response) {
  const data = await leerJson(response).catch(() => ({}));
  throw new Error(data.error || `Error HTTP ${response.status}`);
}

export function useFetch(urlInicial, opciones = {}) {
  const valorInicialRef = useRef(opciones.initialData ?? null);
  const [data, setData] = useState(() => valorInicialRef.current);
  const [cargando, setCargando] = useState(Boolean(opciones.immediate && urlInicial));
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const abortar = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setCargando(false);
  }, []);

  const ejecutar = useCallback(
    async (url = urlInicial, init = {}) => {
      if (!url) {
        return valorInicialRef.current;
      }

      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setCargando(true);
      setError(null);

      try {
        const response = await fetch(url, {
          ...init,
          signal: controller.signal,
        });

        if (!response.ok) {
          await lanzarErrorHttp(response);
        }

        const resultado = await leerJson(response);
        if (!controller.signal.aborted) {
          setData(resultado);
        }
        return resultado;
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err);
        }
        throw err;
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
          setCargando(false);
        }
      }
    },
    [urlInicial]
  );

  useEffect(() => {
    if (!opciones.immediate || !urlInicial) return undefined;

    ejecutar(urlInicial).catch((err) => {
      if (err.name !== 'AbortError') {
        console.error(err);
      }
    });

    return abortar;
  }, [abortar, ejecutar, opciones.immediate, urlInicial]);

  return {
    data,
    setData,
    cargando,
    error,
    ejecutar,
    abortar,
  };
}
