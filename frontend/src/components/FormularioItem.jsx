import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { CATEGORIAS } from '../utils/categorias.js';
import { ESTADOS } from '../utils/constants.js';
import { crearItemDesdeFormulario, itemAFormulario } from '../utils/itemFactory.js';

const formInicial = {
  id: '',
  nombre: '',
  categoriaId: 'rpg',
  estado: 'pendiente',
  puntuacion: '',
  fechaRegistro: '',
  notas: '',
  atributosTexto: '{\n  "plataforma": "",\n  "horas": 0\n}',
};

function FormularioItem({ itemEditando, onGuardar, onCancelar, focusTrigger, tituloId }) {
  const [form, setForm] = useState(() =>
    itemEditando ? itemAFormulario(itemEditando) : formInicial
  );
  const [enviando, setEnviando] = useState(false);
  const nombreInputRef = useRef(null);

  useEffect(() => {
    setForm(itemEditando ? itemAFormulario(itemEditando) : formInicial);
    if (!itemEditando) return undefined;

    const frame = requestAnimationFrame(() => {
      nombreInputRef.current?.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, [itemEditando]);

  useEffect(() => {
    if (focusTrigger > 0) {
      nombreInputRef.current?.focus();
    }
  }, [focusTrigger]);

  const actualizar = useCallback((campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!form.nombre.trim() || enviando) return;

      setEnviando(true);
      try {
        await onGuardar(crearItemDesdeFormulario(form));
        if (!itemEditando) {
          setForm(formInicial);
        }
      } finally {
        setEnviando(false);
      }
    },
    [enviando, form, itemEditando, onGuardar]
  );

  return (
    <form className="formulario" onSubmit={handleSubmit} aria-busy={enviando}>
      <h2 id={tituloId}>{itemEditando ? 'Editar meta' : 'Nueva meta'}</h2>

      <label>
        Nombre
        <input
          ref={nombreInputRef}
          value={form.nombre}
          onChange={(e) => actualizar('nombre', e.target.value)}
          placeholder="Ej: Terminar Elden Ring"
          required
        />
      </label>

      <label>
        Categoria
        <select
          value={form.categoriaId}
          onChange={(e) => actualizar('categoriaId', e.target.value)}
        >
          {CATEGORIAS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.emoji} {c.nombre}
            </option>
          ))}
        </select>
      </label>

      <label>
        Estado
        <select value={form.estado} onChange={(e) => actualizar('estado', e.target.value)}>
          {ESTADOS.map((est) => (
            <option key={est.id} value={est.id}>
              {est.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Puntuacion (0-10, vacio = sin nota)
        <input
          type="number"
          min="0"
          max="10"
          step="0.5"
          value={form.puntuacion}
          onChange={(e) => actualizar('puntuacion', e.target.value)}
        />
      </label>

      <label>
        Notas
        <textarea
          value={form.notas}
          onChange={(e) => actualizar('notas', e.target.value)}
          rows={2}
        />
      </label>

      <label>
        Atributos (JSON)
        <textarea
          value={form.atributosTexto}
          onChange={(e) => actualizar('atributosTexto', e.target.value)}
          rows={4}
        />
      </label>

      <section className="form-actions">
        <button type="submit" className={enviando ? 'btn-loading' : undefined} disabled={enviando}>
          {enviando ? 'Guardando...' : itemEditando ? 'Actualizar' : 'Crear'}
        </button>
        {itemEditando && (
          <button type="button" className="btn-secondary" onClick={onCancelar} disabled={enviando}>
            Cancelar
          </button>
        )}
      </section>
    </form>
  );
}

export default memo(FormularioItem);
