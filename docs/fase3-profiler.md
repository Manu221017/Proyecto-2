# Fase 3 - Evidencia de rendimiento

## Cambios aplicados

- `useReducer` centraliza el estado de metas, filtros, edicion y actividad en `metasReducer`.
- Acciones puras modeladas: `HIDRATAR`, `AGREGAR`, `ELIMINAR`, `CAMBIAR_ESTADO`, `FILTRAR`, `LIMPIAR_FILTROS`, `REGISTRAR_ACTIVIDAD`, `EDITAR` y `CANCELAR_EDICION`.
- `useMemo` calcula la lista filtrada, estadisticas y datasets de graficas.
- `useCallback` estabiliza los handlers enviados a formulario, filtros y tarjetas.
- `React.memo` envuelve `ItemCard`, `ListaItems`, `FormularioItem`, `PanelFiltros` y `DashboardGraficas`.
- `Profiler` de React queda envolviendo `FormularioItem`, `PanelFiltros`, `DashboardGraficas` y `ListaItems`; en desarrollo escribe mediciones en consola con la etiqueta `[Fase 3 Profiler]`.

## Capturas para React DevTools Profiler

1. Antes: abrir la rama `fase-2`, grabar en React DevTools Profiler y escribir en un filtro o cambiar una meta.
2. Despues: abrir la rama `fase-3`, repetir la misma accion y guardar la captura.
3. Comparar `actualDuration` y la lista de componentes renderizados.

## Analisis escrito

Antes de la fase 3, los handlers se recreaban en `App` en cada render y no existia una lista filtrada memoizada. Al agregar filtros y graficas sin memoizacion, cada cambio de filtro habria recalculado estadisticas, datasets de graficas y habria enviado nuevas referencias a las tarjetas.

Despues de la fase 3, al cambiar un filtro solo se recalculan `itemsFiltrados` y `estadisticas`. `DashboardGraficas` conserva los mismos props porque sus datos dependen de `items` y `actividad`, no de `filtros`, por lo que `React.memo` evita su render en ese caso.

`ItemCard` tambien deja de re-renderizarse cuando cambian filtros que no modifican el objeto `item` ni los callbacks. `ListaItems` puede renderizar porque recibe una lista distinta, pero las tarjetas ya visibles mantienen props estables y React puede saltarlas. Cuando se edita una meta concreta, solo la tarjeta asociada recibe un objeto actualizado.

`PanelFiltros` si debe re-renderizar al cambiar filtros porque muestra los controles activos y las estadisticas del subconjunto filtrado. `FormularioItem` re-renderiza localmente al escribir en el formulario, sin obligar a recalcular graficas ni la lista completa.
