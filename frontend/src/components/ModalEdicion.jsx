import { useEffect } from 'react';
import FormularioItem from './FormularioItem.jsx';

export default function ModalEdicion({ itemEditando, onGuardar, onCancelar, focusTrigger }) {
  function cerrarDesdeFondo(e) {
    if (e.target === e.currentTarget) {
      onCancelar();
    }
  }

  useEffect(() => {
    function cerrarConEscape(e) {
      if (e.key === 'Escape') {
        onCancelar();
      }
    }

    document.addEventListener('keydown', cerrarConEscape);
    return () => document.removeEventListener('keydown', cerrarConEscape);
  }, [onCancelar]);

  useEffect(() => {
    const overflowOriginal = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflowOriginal;
    };
  }, []);

  return (
    <section className="modal-backdrop" onMouseDown={cerrarDesdeFondo}>
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-edicion-titulo"
      >
        <FormularioItem
          itemEditando={itemEditando}
          onGuardar={onGuardar}
          onCancelar={onCancelar}
          focusTrigger={focusTrigger}
          tituloId="modal-edicion-titulo"
        />
      </div>
    </section>
  );
}
