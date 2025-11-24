import { Enemigo } from './Enemigo.js';
import { MULTIPLICADOR_JEFE } from '../constants.js';

/**
 * Clase que representa a un jefe (hereda de Enemigo)
 */
export class Jefe extends Enemigo {
  /**
   * Constructor del jefe
   * @param {string} nombre - Nombre del jefe
   * @param {string} avatar - Ruta de la imagen del jefe
   * @param {number} ataque - Nivel de ataque del jefe
   * @param {number} vida - Puntos de vida del jefe
   * @param {number} multiplicadorDano - Multiplicador de daño (por defecto desde constants)
   */
  constructor(nombre, avatar, ataque, vida, multiplicadorDano = MULTIPLICADOR_JEFE) {
    super(nombre, avatar, ataque, vida);
    this.multiplicadorDano = multiplicadorDano;
  }
}