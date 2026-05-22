import { useState } from 'react';
import BarraHerramientas from './components/BarraHerramientas.jsx';
import FormularioItem from './components/FormularioItem.jsx';
import ListaItems from './components/ListaItems.jsx';
import { useStorage } from './context/StorageContext.jsx';

export default function App() {
  const { items, cargando, guardarItem, eliminarItem } = useStorage();
  const [itemEditando, setItemEditando] = useState(null);
  const [focusTrigger, setFocusTrigger] = useState(0);

  async function handleGuardar(item) {
    const esNuevo = !itemEditando;
    await guardarItem(item);
    setItemEditando(null);
    if (esNuevo) setFocusTrigger((n) => n + 1);
  }

  async function handleArchivar(id) {
    await eliminarItem(id);
    setItemEditando(null);
  }

  async function handleCompletado(item) {
    await guardarItem({
      ...item,
      estado: 'completado',
      puntuacion: item.puntuacion ?? 10,
    });
  }

  return (
    <main className="app">
      <header className="app-header">
        <h1>Mis metas personales</h1>
        <p>Fase 2 — Context, tema y API / LocalStorage (UVG)</p>
      </header>

      <BarraHerramientas />

      <FormularioItem
        itemEditando={itemEditando}
        onGuardar={handleGuardar}
        onCancelar={() => setItemEditando(null)}
        focusTrigger={focusTrigger}
      />

      {cargando ? (
        <p className="vacio">Cargando metas…</p>
      ) : (
        <ListaItems
          items={items}
          onEditar={setItemEditando}
          onArchivar={handleArchivar}
          onMarcarCompletado={handleCompletado}
        />
      )}
    </main>
  );
}
