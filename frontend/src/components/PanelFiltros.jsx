import { memo } from 'react';
import { CATEGORIAS } from '../utils/categorias.js';
import { ESTADOS } from '../utils/constants.js';

function PanelFiltros({ filtros, estadisticas, onFiltrar, onLimpiar }) {
  return (
    <section className="panel-filtros">
      <div className="metricas">
        <article>
          <span>Total</span>
          <strong>{estadisticas.total}</strong>
        </article>
        <article>
          <span>Completadas</span>
          <strong>{estadisticas.completadas}</strong>
        </article>
        <article>
          <span>Promedio</span>
          <strong>{estadisticas.promedioPuntuacion}</strong>
        </article>
        <article>
          <span>Avance</span>
          <strong>{estadisticas.porcentajeCompletado}%</strong>
        </article>
      </div>

      <div className="filtros-grid">
        <label>
          Buscar
          <input
            value={filtros.texto}
            onChange={(e) => onFiltrar({ texto: e.target.value })}
            placeholder="Nombre o notas"
          />
        </label>

        <label>
          Categoria
          <select
            value={filtros.categoriaId}
            onChange={(e) => onFiltrar({ categoriaId: e.target.value })}
          >
            <option value="todas">Todas</option>
            {CATEGORIAS.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.emoji} {categoria.nombre}
              </option>
            ))}
          </select>
        </label>

        <label>
          Estado
          <select
            value={filtros.estado}
            onChange={(e) => onFiltrar({ estado: e.target.value })}
          >
            <option value="todos">Todos</option>
            {ESTADOS.map((estado) => (
              <option key={estado.id} value={estado.id}>
                {estado.label}
              </option>
            ))}
          </select>
        </label>

        <button type="button" className="btn-secondary" onClick={onLimpiar}>
          Limpiar filtros
        </button>
      </div>
    </section>
  );
}

export default memo(PanelFiltros);
