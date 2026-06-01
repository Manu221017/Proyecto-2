import { useCallback, useEffect, useState } from 'react';

function resolverValorInicial(valorInicial) {
  return typeof valorInicial === 'function' ? valorInicial() : valorInicial;
}

function leerStorage(clave, valorInicial) {
  if (typeof window === 'undefined') {
    return resolverValorInicial(valorInicial);
  }

  const valorGuardado = window.localStorage.getItem(clave);
  if (valorGuardado === null) {
    return resolverValorInicial(valorInicial);
  }

  try {
    return JSON.parse(valorGuardado);
  } catch {
    return valorGuardado;
  }
}

export function useLocalStorage(clave, valorInicial) {
  const [valor, setValorState] = useState(() => leerStorage(clave, valorInicial));

  const setValor = useCallback(
    (siguienteValor) => {
      setValorState((valorActual) => {
        const valorResuelto =
          typeof siguienteValor === 'function' ? siguienteValor(valorActual) : siguienteValor;

        window.localStorage.setItem(clave, JSON.stringify(valorResuelto));
        return valorResuelto;
      });
    },
    [clave]
  );

  useEffect(() => {
    setValorState(leerStorage(clave, valorInicial));
  }, [clave, valorInicial]);

  useEffect(() => {
    function sincronizarStorage(evento) {
      if (evento.key === clave) {
        setValorState(leerStorage(clave, valorInicial));
      }
    }

    window.addEventListener('storage', sincronizarStorage);
    return () => window.removeEventListener('storage', sincronizarStorage);
  }, [clave, valorInicial]);

  return [valor, setValor];
}
