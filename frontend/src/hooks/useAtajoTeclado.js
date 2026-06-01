import { useEffect, useRef } from 'react';

const CAMPOS_EDITABLES = ['INPUT', 'TEXTAREA', 'SELECT'];

function esCampoEditable(elemento) {
  if (!elemento) return false;
  return elemento.isContentEditable || CAMPOS_EDITABLES.includes(elemento.tagName);
}

export function useAtajoTeclado(tecla, callback, opciones = {}) {
  const callbackRef = useRef(callback);
  const {
    habilitado = true,
    ignorarCampos = true,
    prevenirDefault = true,
    ctrlKey = false,
    altKey = false,
    shiftKey = false,
    metaKey = false,
  } = opciones;

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!habilitado) return undefined;

    const teclaNormalizada = tecla.toLowerCase();

    function manejarKeydown(evento) {
      if (ignorarCampos && esCampoEditable(evento.target)) return;
      if (evento.key.toLowerCase() !== teclaNormalizada) return;
      if (evento.ctrlKey !== ctrlKey) return;
      if (evento.altKey !== altKey) return;
      if (evento.shiftKey !== shiftKey) return;
      if (evento.metaKey !== metaKey) return;

      if (prevenirDefault) {
        evento.preventDefault();
      }
      callbackRef.current(evento);
    }

    window.addEventListener('keydown', manejarKeydown);
    return () => window.removeEventListener('keydown', manejarKeydown);
  }, [altKey, ctrlKey, habilitado, ignorarCampos, metaKey, prevenirDefault, shiftKey, tecla]);
}
