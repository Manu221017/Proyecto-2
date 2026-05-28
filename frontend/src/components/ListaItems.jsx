import { memo, useEffect, useRef } from 'react';
import ItemCard from './ItemCard.jsx';

function ListaItems({ items, onEditar, onArchivar, onCambiarEstado, onRegistrarActividad }) {
  const listaRef = useRef(null);
  const intervaloRef = useRef(null);

  useEffect(() => {
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    }

    if (items.length < 2 || !listaRef.current) return undefined;

    intervaloRef.current = setInterval(() => {
      const el = listaRef.current;
      if (!el) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      if (el.scrollLeft >= max - 2) {
        el.scrollLeft = 0;
      } else {
        el.scrollLeft += 1;
      }
    }, 40);

    return () => {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
        intervaloRef.current = null;
      }
    };
  }, [items.length]);

  if (items.length === 0) {
    return <p className="vacio">No hay metas con los filtros actuales.</p>;
  }

  return (
    <section className="lista-items">
      <h2>Mis metas ({items.length})</h2>
      <section className="grid grid-scroll" ref={listaRef}>
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onEditar={onEditar}
            onArchivar={onArchivar}
            onCambiarEstado={onCambiarEstado}
            onRegistrarActividad={onRegistrarActividad}
          />
        ))}
      </section>
    </section>
  );
}

export default memo(ListaItems);
