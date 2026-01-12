import { UMBRAL_VETERANO } from '../constants.js';

/**
 * Distingue al jugador como Veterano o Novato según su puntuación
 * @param {number} puntuacion - Puntuación del jugador
 * @param {number} umbral - Umbral para ser veterano (por defecto desde constants)
 * @returns {string} "Veterano" o "Novato"
 */
export function distinguirJugador(puntuacion, umbral = UMBRAL_VETERANO) {
  return puntuacion >= umbral ? 'Veterano' : 'Novato';
}

/**
 * Guarda el registro del jugador en LocalStorage
 * @param {string} nombre - Nombre del jugador
 * @param {number} puntuacion - Puntuación del jugador
 * @param {number} dinero - Dinero del jugador en céntimos
 */
export function guardarRanking(nombre, puntuacion, dinero) {
  // Obtener ranking actual o crear array vacío
  let ranking = obtenerRanking();
  
  // Calcular puntuación total: puntos + dinero restante en céntimos
  const puntuacionTotal = puntuacion + dinero;
  
  // Añadir nuevo registro
  const nuevoRegistro = {
    nombre: nombre,
    puntuacion: puntuacion,
    dinero: dinero, // Guardamos en céntimos
    puntuacionTotal: puntuacionTotal,
    fecha: new Date().toISOString()
  };
  
  ranking.push(nuevoRegistro);
  
  // Ordenar por puntuación total (descendente)
  ranking.sort((a, b) => b.puntuacionTotal - a.puntuacionTotal);
  
  // Guardar en localStorage
  localStorage.setItem('rankingJS', JSON.stringify(ranking));
}

/**
 * Obtiene el ranking desde LocalStorage
 * @returns {Array} Array con los registros del ranking
 */
export function obtenerRanking() {
  const rankingStr = localStorage.getItem('rankingJS');
  return rankingStr ? JSON.parse(rankingStr) : [];
}

/**
 * Muestra el ranking en consola
 */
export function mostrarRankingConsola() {
  const ranking = obtenerRanking();
  
  if (ranking.length === 0) {
    console.log('No hay registros en el ranking aún.');
    return;
  }
  
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('                    RANKING DE JUGADORES                        ');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('Pos | Nombre              | Puntuación | Dinero    | Total     ');
  console.log('────────────────────────────────────────────────────────────────');
  
  ranking.forEach((registro, index) => {
    const pos = (index + 1).toString().padStart(3, ' ');
    const nombre = registro.nombre.padEnd(20, ' ').substring(0, 20);
    const puntos = registro.puntuacion.toString().padStart(10, ' ');
    const dineroFormateado = `${(registro.dinero / 100).toFixed(2)}€`.padStart(10, ' ');
    const total = registro.puntuacionTotal.toString().padStart(10, ' ');
    
    console.log(`${pos} | ${nombre} | ${puntos} | ${dineroFormateado} | ${total}`);
  });
  
  console.log('═══════════════════════════════════════════════════════════════');
}

/**
 * Borra todo el ranking (útil para testing)
 */
export function borrarRanking() {
  localStorage.removeItem('rankingJS');
  console.log('Ranking borrado correctamente.');
}