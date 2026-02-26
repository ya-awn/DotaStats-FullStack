// helpers.js — funciones utilitarias puras (no son componentes React)

export const calcularHaceCuanto = (fechaString) => {
  if (!fechaString) return "N/A";
  const fechaPartida = new Date(fechaString);
  const ahora = new Date();
  const diferenciaMs = ahora - fechaPartida;
  const minutos = Math.floor(diferenciaMs / (1000 * 60));
  const horas = Math.floor(diferenciaMs / (1000 * 60 * 60));
  const dias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
  if (minutos < 60) return `hace ${minutos} min`;
  if (horas < 24) return `hace ${horas} hs`;
  return `hace ${dias} ${dias === 1 ? "día" : "días"}`;
};

export const PIE_COLORS = [
  "#e43333", "#4CAF50", "#2196F3", "#FF9800", "#9C27B0",
  "#00BCD4", "#FFEB3B", "#FF5722", "#8BC34A", "#3F51B5"
];