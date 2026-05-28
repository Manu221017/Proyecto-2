export const ACCIONES = {
  HIDRATAR: 'HIDRATAR',
  AGREGAR: 'AGREGAR',
  ELIMINAR: 'ELIMINAR',
  CAMBIAR_ESTADO: 'CAMBIAR_ESTADO',
  FILTRAR: 'FILTRAR',
  LIMPIAR_FILTROS: 'LIMPIAR_FILTROS',
  REGISTRAR_ACTIVIDAD: 'REGISTRAR_ACTIVIDAD',
  EDITAR: 'EDITAR',
  CANCELAR_EDICION: 'CANCELAR_EDICION',
};

export const filtrosIniciales = {
  texto: '',
  categoriaId: 'todas',
  estado: 'todos',
};

export const estadoInicialMetas = {
  items: [],
  filtros: filtrosIniciales,
  itemEditando: null,
  focusTrigger: 0,
  actividad: [],
};

function ordenarPorActividad(items) {
  return [...items].sort(
    (a, b) => new Date(b.fechaActividad).getTime() - new Date(a.fechaActividad).getTime()
  );
}

function upsertItem(items, item) {
  const existe = items.some((actual) => actual.id === item.id);
  const siguientes = existe
    ? items.map((actual) => (actual.id === item.id ? { ...actual, ...item } : actual))
    : [item, ...items];

  return ordenarPorActividad(siguientes);
}

export function metasReducer(state, action) {
  switch (action.type) {
    case ACCIONES.HIDRATAR:
      return {
        ...state,
        items: ordenarPorActividad(action.payload.items ?? []),
        actividad: action.payload.actividad ?? state.actividad,
      };

    case ACCIONES.AGREGAR: {
      const existe = state.items.some((item) => item.id === action.payload.id);
      const esNuevo = action.meta?.esNuevo ?? !existe;

      return {
        ...state,
        items: upsertItem(state.items, action.payload),
        itemEditando: null,
        focusTrigger: esNuevo ? state.focusTrigger + 1 : state.focusTrigger,
      };
    }

    case ACCIONES.ELIMINAR:
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
        itemEditando:
          state.itemEditando?.id === action.payload.id ? null : state.itemEditando,
      };

    case ACCIONES.CAMBIAR_ESTADO:
      return {
        ...state,
        items: ordenarPorActividad(
          state.items.map((item) =>
            item.id === action.payload.id
              ? {
                  ...item,
                  estado: action.payload.estado,
                  puntuacion:
                    action.payload.puntuacion !== undefined
                      ? action.payload.puntuacion
                      : item.puntuacion,
                  fechaActividad: action.payload.fechaActividad,
                }
              : item
          )
        ),
      };

    case ACCIONES.FILTRAR:
      return {
        ...state,
        filtros: {
          ...state.filtros,
          ...action.payload,
        },
      };

    case ACCIONES.LIMPIAR_FILTROS:
      return {
        ...state,
        filtros: filtrosIniciales,
      };

    case ACCIONES.REGISTRAR_ACTIVIDAD:
      return {
        ...state,
        actividad: [action.payload, ...state.actividad].slice(0, 50),
        items: ordenarPorActividad(
          state.items.map((item) =>
            item.id === action.payload.itemId
              ? {
                  ...item,
                  fechaActividad: action.payload.fecha,
                  puntuacion: action.payload.valor ?? item.puntuacion,
                }
              : item
          )
        ),
      };

    case ACCIONES.EDITAR:
      return {
        ...state,
        itemEditando: action.payload.item,
      };

    case ACCIONES.CANCELAR_EDICION:
      return {
        ...state,
        itemEditando: null,
      };

    default:
      return state;
  }
}
