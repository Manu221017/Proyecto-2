import { Profiler, useCallback, useEffect, useMemo, useReducer } from 'react';
import BarraHerramientas from './components/BarraHerramientas.jsx';
import DashboardGraficas from './components/DashboardGraficas.jsx';
import FormularioItem from './components/FormularioItem.jsx';
import ListaItems from './components/ListaItems.jsx';
import PanelFiltros from './components/PanelFiltros.jsx';
import { useStorage } from './context/StorageContext.jsx';
import { CATEGORIAS } from './utils/categorias.js';
import { ACCIONES, estadoInicialMetas, metasReducer } from './reducers/metasReducer.js';

function claveDia(fecha) {
  return `${fecha.getFullYear()}-${fecha.getMonth() + 1}-${fecha.getDate()}`;
}

function crearActividad(tipo, item, fecha, valor = item?.puntuacion ?? null) {
  return {
    id: crypto.randomUUID(),
    itemId: item.id,
    itemNombre: item.nombre,
    tipo,
    fecha,
    valor,
  };
}

function filtrarItems(items, filtros) {
  const texto = filtros.texto.trim().toLowerCase();

  return items.filter((item) => {
    const coincideTexto =
      !texto ||
      item.nombre.toLowerCase().includes(texto) ||
      item.notas?.toLowerCase().includes(texto);
    const coincideCategoria =
      filtros.categoriaId === 'todas' || item.categoriaId === filtros.categoriaId;
    const coincideEstado = filtros.estado === 'todos' || item.estado === filtros.estado;

    return coincideTexto && coincideCategoria && coincideEstado;
  });
}

function calcularEstadisticas(items) {
  const total = items.length;
  const completadas = items.filter((item) => item.estado === 'completado').length;
  const conPuntuacion = items.filter((item) => item.puntuacion != null);
  const promedio =
    conPuntuacion.length === 0
      ? 0
      : conPuntuacion.reduce((acc, item) => acc + Number(item.puntuacion), 0) /
        conPuntuacion.length;

  return {
    total,
    completadas,
    promedioPuntuacion: promedio.toFixed(1),
    porcentajeCompletado: total === 0 ? 0 : Math.round((completadas / total) * 100),
  };
}

function construirDatosGraficas(items, actividad) {
  const hoy = new Date();
  const dias = Array.from({ length: 7 }, (_, index) => {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() - (6 - index));
    return {
      key: claveDia(fecha),
      dia: `${fecha.getDate()}/${fecha.getMonth() + 1}`,
      actividad: 0,
    };
  });

  const diasPorKey = new Map(dias.map((dia) => [dia.key, dia]));
  const eventosUnicos = new Map();

  items.forEach((item) => {
    if (item.fechaActividad) {
      eventosUnicos.set(`${item.id}-${item.fechaActividad}`, item.fechaActividad);
    }
  });

  actividad.forEach((registro) => {
    eventosUnicos.set(`${registro.itemId}-${registro.fecha}`, registro.fecha);
  });

  eventosUnicos.forEach((fechaEvento) => {
    const fecha = new Date(fechaEvento);
    if (Number.isNaN(fecha.getTime())) return;
    const dia = diasPorKey.get(claveDia(fecha));
    if (dia) dia.actividad += 1;
  });

  const distribucionCategorias = CATEGORIAS.map((categoria) => {
    const total = items.filter((item) => item.categoriaId === categoria.id).length;
    return {
      name: categoria.nombre,
      value: total,
      color: categoria.color,
    };
  }).filter((categoria) => categoria.value > 0);

  const radarCategorias = CATEGORIAS.map((categoria) => {
    const metas = items.filter((item) => item.categoriaId === categoria.id);
    if (metas.length === 0) return null;

    const completadas = metas.filter((item) => item.estado === 'completado').length;
    const conPuntuacion = metas.filter((item) => item.puntuacion != null);
    const promedio =
      conPuntuacion.length === 0
        ? 0
        : conPuntuacion.reduce((acc, item) => acc + Number(item.puntuacion), 0) /
          conPuntuacion.length;
    const avance = completadas / metas.length;
    const volumen = Math.min(metas.length, 5) / 5;
    const indice = Math.round(avance * 55 + promedio * 3.5 + volumen * 10);

    return {
      categoria: categoria.nombre,
      indice: Math.min(indice, 100),
    };
  }).filter(Boolean);

  return {
    actividad7Dias: dias,
    distribucionCategorias,
    radarCategorias,
  };
}

export default function App() {
  const {
    items: itemsPersistidos,
    cargando,
    guardarItem,
    eliminarItem,
    registrarActividad,
  } = useStorage();
  const [estado, dispatch] = useReducer(metasReducer, estadoInicialMetas);

  useEffect(() => {
    dispatch({
      type: ACCIONES.HIDRATAR,
      payload: { items: itemsPersistidos },
    });
  }, [itemsPersistidos]);

  const itemsFiltrados = useMemo(
    () => filtrarItems(estado.items, estado.filtros),
    [estado.items, estado.filtros]
  );

  const estadisticas = useMemo(
    () => calcularEstadisticas(itemsFiltrados),
    [itemsFiltrados]
  );

  const datosGraficas = useMemo(
    () => construirDatosGraficas(estado.items, estado.actividad),
    [estado.items, estado.actividad]
  );

  const handleGuardar = useCallback(
    async (item) => {
      const esNuevo = !estado.itemEditando;
      const guardado = await guardarItem(item);
      const itemFinal = guardado ?? item;
      const fecha = itemFinal.fechaActividad ?? new Date().toISOString();

      dispatch({
        type: ACCIONES.AGREGAR,
        payload: itemFinal,
        meta: { esNuevo },
      });
      dispatch({
        type: ACCIONES.REGISTRAR_ACTIVIDAD,
        payload: crearActividad(esNuevo ? 'creacion' : 'actualizacion', itemFinal, fecha),
      });
    },
    [estado.itemEditando, guardarItem]
  );

  const handleArchivar = useCallback(
    async (id) => {
      const item = estado.items.find((actual) => actual.id === id);
      const fecha = new Date().toISOString();

      await eliminarItem(id);
      dispatch({ type: ACCIONES.ELIMINAR, payload: { id } });

      if (item) {
        dispatch({
          type: ACCIONES.REGISTRAR_ACTIVIDAD,
          payload: crearActividad('archivo', item, fecha),
        });
      }
    },
    [eliminarItem, estado.items]
  );

  const handleCambiarEstado = useCallback(
    async (item, nuevoEstado) => {
      const fecha = new Date().toISOString();
      const puntuacion =
        nuevoEstado === 'completado' && item.puntuacion == null ? 10 : item.puntuacion;
      const actualizado = {
        ...item,
        estado: nuevoEstado,
        puntuacion,
        fechaActividad: fecha,
      };
      const guardado = await guardarItem(actualizado);
      const itemFinal = guardado ?? actualizado;

      dispatch({
        type: ACCIONES.CAMBIAR_ESTADO,
        payload: {
          id: itemFinal.id,
          estado: itemFinal.estado,
          puntuacion: itemFinal.puntuacion,
          fechaActividad: itemFinal.fechaActividad ?? fecha,
        },
      });
      dispatch({
        type: ACCIONES.REGISTRAR_ACTIVIDAD,
        payload: crearActividad(`estado:${nuevoEstado}`, itemFinal, itemFinal.fechaActividad ?? fecha),
      });
    },
    [guardarItem]
  );

  const handleRegistrarActividad = useCallback(
    async (item) => {
      const fecha = new Date().toISOString();
      const actualizado = {
        ...item,
        fechaActividad: fecha,
      };
      const registro = await registrarActividad(item.id, {
        fecha,
        valor: item.puntuacion ?? null,
        notas: 'Actividad registrada desde la app',
      });
      const itemFinal = {
        ...actualizado,
        fechaActividad: registro.fecha ?? fecha,
        puntuacion: registro.valor ?? item.puntuacion,
      };

      dispatch({
        type: ACCIONES.REGISTRAR_ACTIVIDAD,
        payload: crearActividad(
          'actividad',
          itemFinal,
          registro.fecha ?? fecha,
          registro.valor ?? itemFinal.puntuacion
        ),
      });
    },
    [registrarActividad]
  );

  const handleFiltrar = useCallback((filtroParcial) => {
    dispatch({ type: ACCIONES.FILTRAR, payload: filtroParcial });
  }, []);

  const handleLimpiarFiltros = useCallback(() => {
    dispatch({ type: ACCIONES.LIMPIAR_FILTROS });
  }, []);

  const handleEditar = useCallback((item) => {
    dispatch({ type: ACCIONES.EDITAR, payload: { item } });
  }, []);

  const handleCancelarEdicion = useCallback(() => {
    dispatch({ type: ACCIONES.CANCELAR_EDICION });
  }, []);

  const handleProfilerRender = useCallback((id, phase, actualDuration, baseDuration) => {
    if (import.meta.env.DEV) {
      console.info('[Fase 3 Profiler]', {
        componente: id,
        fase: phase,
        duracionActualMs: Number(actualDuration.toFixed(2)),
        duracionBaseMs: Number(baseDuration.toFixed(2)),
      });
    }
  }, []);

  return (
    <main className="app">
      <header className="app-header">
        <h1>Mis metas personales</h1>
        <p>Fase 3 - useReducer, graficas y optimizacion</p>
      </header>

      <BarraHerramientas />

      <Profiler id="FormularioItem" onRender={handleProfilerRender}>
        <FormularioItem
          itemEditando={estado.itemEditando}
          onGuardar={handleGuardar}
          onCancelar={handleCancelarEdicion}
          focusTrigger={estado.focusTrigger}
        />
      </Profiler>

      {cargando ? (
        <p className="vacio">Cargando metas...</p>
      ) : (
        <>
          <Profiler id="PanelFiltros" onRender={handleProfilerRender}>
            <PanelFiltros
              filtros={estado.filtros}
              estadisticas={estadisticas}
              onFiltrar={handleFiltrar}
              onLimpiar={handleLimpiarFiltros}
            />
          </Profiler>

          <Profiler id="DashboardGraficas" onRender={handleProfilerRender}>
            <DashboardGraficas
              actividad7Dias={datosGraficas.actividad7Dias}
              distribucionCategorias={datosGraficas.distribucionCategorias}
              radarCategorias={datosGraficas.radarCategorias}
            />
          </Profiler>

          <Profiler id="ListaItems" onRender={handleProfilerRender}>
            <ListaItems
              items={itemsFiltrados}
              onEditar={handleEditar}
              onArchivar={handleArchivar}
              onCambiarEstado={handleCambiarEstado}
              onRegistrarActividad={handleRegistrarActividad}
            />
          </Profiler>
        </>
      )}
    </main>
  );
}
