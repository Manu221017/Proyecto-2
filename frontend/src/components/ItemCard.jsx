import { buscarCategoria } from '../utils/categorias.js';
import { ESTADOS } from '../utils/constants.js';

function etiquetaEstado(id) {
  return ESTADOS.find((x) => x.id === id)?.label ?? id;
}

export default function ItemCard({ item, onEditar, onArchivar, onMarcarCompletado }) {
  const cat = buscarCategoria(item.categoriaId);

  return (
    <article
      className="item-card"
      style={cat ? { borderLeftColor: cat.color, borderLeftWidth: '4px' } : undefined}
    >
      <header>
        <h3>
          {cat?.emoji} {item.nombre}
        </h3>
        <span className={`badge badge-${item.estado}`}>{etiquetaEstado(item.estado)}</span>
      </header>

      <p className="meta">
        <strong>Categoría:</strong>{' '}
        <span style={{ color: cat?.color }}>{cat?.nombre ?? item.categoriaId}</span>
      </p>

      {item.puntuacion != null && (
        <p className="meta">
          <strong>Puntuación:</strong> {item.puntuacion}/10
        </p>
      )}

      {item.notas && <p className="notas">{item.notas}</p>}

      {item.atributos && Object.keys(item.atributos).length > 0 && (
        <pre className="atributos">{JSON.stringify(item.atributos, null, 2)}</pre>
      )}

      <p className="fechas">
        Registro: {new Date(item.fechaRegistro).toLocaleString('es-GT')}
        <br />
        Actividad: {new Date(item.fechaActividad).toLocaleString('es-GT')}
      </p>

      <section className="card-actions">
        <button type="button" onClick={() => onEditar(item)}>
          Editar
        </button>
        {item.estado !== 'completado' && (
          <button type="button" onClick={() => onMarcarCompletado(item)}>
            Completar
          </button>
        )}
        <button type="button" className="btn-danger" onClick={() => onArchivar(item.id)}>
          Archivar
        </button>
      </section>
    </article>
  );
}
