import { useEffect, useState } from 'react';
import FormularioItem from './components/FormularioItem.jsx';
import ListaItems from './components/ListaItems.jsx';
import { STORAGE_KEY } from './utils/constants.js';

export default function App() {
  const [items, setItems] = useState(() =>
    JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  );
  const [itemEditando, setItemEditando] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const activos = items.filter((i) => i.activo !== false);

  function handleGuardar(item) {
    setItems((prev) => {
      const existe = prev.some((i) => i.id === item.id);
      if (existe) {
        return prev.map((i) => (i.id === item.id ? { ...item, fechaActividad: new Date().toISOString() } : i));
      }
      return [...prev, item];
    });
    setItemEditando(null);
  }

  function handleArchivar(id) {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, activo: false, fechaActividad: new Date().toISOString() } : i
      )
    );
    setItemEditando(null);
  }

  function handleCompletado(item) {
    handleGuardar({
      ...item,
      estado: 'completado',
      puntuacion: item.puntuacion ?? 10,
    });
  }

  return (
    <main className="app">
      <header className="app-header">
        <h1>Mis metas personales</h1>
        <p>Fase 1 — useState, useEffect y LocalStorage (UVG)</p>
      </header>

      <FormularioItem
        itemEditando={itemEditando}
        onGuardar={handleGuardar}
        onCancelar={() => setItemEditando(null)}
      />

      <ListaItems
        items={activos}
        onEditar={setItemEditando}
        onArchivar={handleArchivar}
        onMarcarCompletado={handleCompletado}
      />
    </main>
  );
}
