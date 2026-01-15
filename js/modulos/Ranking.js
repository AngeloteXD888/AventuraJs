import { UMBRAL_VETERANO } from '../constants.js';

/**
 * Datos por defecto del ranking - AUMENTADOS para tener scroll
 */
const RANKING_DEFAULT = [
  { nombre: 'Shadow', puntuacion: 850, dinero: 3200, puntuacionTotal: 4050, fecha: '2026-01-10T10:30:00.000Z' },
  { nombre: 'Phoenix', puntuacion: 720, dinero: 2800, puntuacionTotal: 3520, fecha: '2026-01-11T14:20:00.000Z' },
  { nombre: 'Blade', puntuacion: 680, dinero: 2400, puntuacionTotal: 3080, fecha: '2026-01-09T16:45:00.000Z' },
  { nombre: 'Nova', puntuacion: 620, dinero: 2100, puntuacionTotal: 2720, fecha: '2026-01-12T09:15:00.000Z' },
  { nombre: 'Viper', puntuacion: 580, dinero: 1900, puntuacionTotal: 2480, fecha: '2026-01-08T11:30:00.000Z' },
  { nombre: 'Storm', puntuacion: 550, dinero: 1700, puntuacionTotal: 2250, fecha: '2026-01-13T15:45:00.000Z' },
  { nombre: 'Raven', puntuacion: 520, dinero: 1500, puntuacionTotal: 2020, fecha: '2026-01-07T13:20:00.000Z' },
  { nombre: 'Titan', puntuacion: 480, dinero: 1300, puntuacionTotal: 1780, fecha: '2026-01-14T08:10:00.000Z' },
  { nombre: 'Specter', puntuacion: 450, dinero: 1100, puntuacionTotal: 1550, fecha: '2026-01-06T17:30:00.000Z' },
  { nombre: 'Ghost', puntuacion: 420, dinero: 900, puntuacionTotal: 1320, fecha: '2026-01-05T12:45:00.000Z' },
  { nombre: 'Wraith', puntuacion: 380, dinero: 800, puntuacionTotal: 1180, fecha: '2026-01-15T10:00:00.000Z' },
  { nombre: 'Frost', puntuacion: 350, dinero: 700, puntuacionTotal: 1050, fecha: '2026-01-04T14:15:00.000Z' },
  { nombre: 'Blaze', puntuacion: 320, dinero: 600, puntuacionTotal: 920, fecha: '2026-01-03T16:40:00.000Z' },
  { nombre: 'Echo', puntuacion: 280, dinero: 500, puntuacionTotal: 780, fecha: '2026-01-02T09:25:00.000Z' },
  { nombre: 'Hawk', puntuacion: 250, dinero: 400, puntuacionTotal: 650, fecha: '2026-01-01T11:50:00.000Z' }
];

/**
 * Inicializa el ranking con datos por defecto si está vacío
 */
export function inicializarRanking() {
  const ranking = localStorage.getItem('rankingJS');
  if (!ranking) {
    localStorage.setItem('rankingJS', JSON.stringify(RANKING_DEFAULT));
  }
}

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

/**
 * Resetea el ranking a los valores por defecto
 */
export function resetearRanking() {
  localStorage.setItem('rankingJS', JSON.stringify(RANKING_DEFAULT));
  console.log('Ranking reseteado a valores por defecto.');
}