import ItemCard from './ItemCard.jsx';

export default function ListaItems({ items, onEditar, onArchivar, onMarcarCompletado }) {
  if (items.length === 0) {
    return <p className="vacio">No hay metas activas. Crea la primera arriba.</p>;
  }

  return (
    <section className="lista-items">
      <h2>Mis metas ({items.length})</h2>
      <section className="grid">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onEditar={onEditar}
            onArchivar={onArchivar}
            onMarcarCompletado={onMarcarCompletado}
          />
        ))}
      </section>
    </section>
  );
}
