export const CATEGORIAS = [
  { id: 'rpg', nombre: 'RPG / Juegos', emoji: '🎮', color: '#7c3aed' },
  { id: 'salud', nombre: 'Salud', emoji: '💪', color: '#16a34a' },
  { id: 'estudio', nombre: 'Estudio', emoji: '📚', color: '#2563eb' },
  { id: 'cocina', nombre: 'Cocina', emoji: '🍳', color: '#ea580c' },
  { id: 'lectura', nombre: 'Lectura', emoji: '📖', color: '#db2777' },
  { id: 'musica', nombre: 'Música', emoji: '🎵', color: '#0891b2' },
];

export function buscarCategoria(id) {
  return CATEGORIAS.find((c) => c.id === id);
}
