/**
 * Clase que representa a un enemigo
 */
export class Enemigo {
  /**
   * Constructor del enemigo
   * @param {string} nombre - Nombre del enemigo
   * @param {string} avatar - Ruta de la imagen del enemigo
   * @param {number} ataque - Nivel de ataque del enemigo
   * @param {number} vida - Puntos de vida del enemigo
   */
  constructor(nombre, avatar, ataque, vida) {
    this.nombre = nombre;
    this.avatar = avatar;
    this.ataque = ataque;
    this.vida = vida;
    this.vidaMaxima = vida;
  }
}