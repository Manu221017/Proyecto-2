import { useStorage } from '../context/StorageContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export default function BarraHerramientas() {
  const { modo, setModo, cargando, error } = useStorage();
  const { tema, alternarTema } = useTheme();

  return (
    <section className="toolbar">
      <label className="toolbar-modo">
        <span>Almacenamiento</span>
        <select value={modo} onChange={(e) => setModo(e.target.value)} disabled={cargando}>
          <option value="local">LocalStorage</option>
          <option value="api">API (Express)</option>
        </select>
      </label>

      <button
        type="button"
        className="btn-theme"
        onClick={alternarTema}
        aria-label="Cambiar tema"
      >
        {tema === 'light' ? 'Modo oscuro' : 'Modo claro'} (T)
      </button>

      {cargando && <span className="toolbar-hint">Cargando...</span>}
      {error && <span className="toolbar-error">{error}</span>}
    </section>
  );
}
