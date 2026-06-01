import { useEffect, useState } from 'react';
import { useStorage } from '../context/StorageContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export default function BarraHerramientas() {
  const { modo, setModo, apiBaseUrl, setApiBaseUrl, cargando, error } = useStorage();
  const { tema, alternarTema } = useTheme();
  const [apiUrlTemporal, setApiUrlTemporal] = useState(apiBaseUrl);

  useEffect(() => {
    setApiUrlTemporal(apiBaseUrl);
  }, [apiBaseUrl]);

  function guardarApiUrl(evento) {
    evento.preventDefault();
    setApiBaseUrl(apiUrlTemporal);
  }

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

      {modo === 'api' && (
        <form className="toolbar-api" onSubmit={guardarApiUrl}>
          <label>
            URL API Render
            <input
              type="url"
              value={apiUrlTemporal}
              onChange={(e) => setApiUrlTemporal(e.target.value)}
              placeholder="https://tu-backend.onrender.com/api"
            />
          </label>
          <button type="submit" className="btn-secondary" disabled={cargando}>
            Guardar API
          </button>
        </form>
      )}

      {cargando && <span className="toolbar-hint">Cargando...</span>}
      {error && <span className="toolbar-error">{error}</span>}
    </section>
  );
}
