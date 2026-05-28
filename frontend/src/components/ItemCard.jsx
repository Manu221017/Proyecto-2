import { memo } from 'react';
import { buscarCategoria } from '../utils/categorias.js';
import { ESTADOS } from '../utils/constants.js';

function etiquetaEstado(id) {
  return ESTADOS.find((x) => x.id === id)?.label ?? id;
}

function ItemCard({ item, onEditar, onArchivar, onCambiarEstado, onRegistrarActividad }) {
  const cat = buscarCategoria(item.categoriaId);
  const siguienteEstado = item.estado === 'en_progreso' ? 'pausado' : 'en_progreso';
  const etiquetaAccionEstado = item.estado === 'en_progreso' ? 'Pausar' : 'Activar';

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
        <strong>Categoria:</strong>{' '}
        <span style={{ color: cat?.color }}>{cat?.nombre ?? item.categoriaId}</span>
      </p>

      {item.puntuacion != null && (
        <p className="meta">
          <strong>Puntuacion:</strong> {item.puntuacion}/10
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
          <button
            type="button"
            className="btn-secondary"
            onClick={() => onCambiarEstado(item, siguienteEstado)}
          >
            {etiquetaAccionEstado}
          </button>
        )}
        {item.estado !== 'completado' && (
          <button type="button" onClick={() => onCambiarEstado(item, 'completado')}>
            Completar
          </button>
        )}
        <button type="button" className="btn-secondary" onClick={() => onRegistrarActividad(item)}>
          Actividad
        </button>
        <button type="button" className="btn-danger" onClick={() => onArchivar(item.id)}>
          Archivar
        </button>
      </section>
    </article>
  );
}

export default memo(ItemCard);
