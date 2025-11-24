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