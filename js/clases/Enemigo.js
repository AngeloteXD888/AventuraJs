/**
 * Clase que representa a un enemigo
 */
export class Enemigo {
  /**
   * Constructor del enemigo
   * @param {string} nombre - Nombre del enemigo
   * @param {string} avatar - Ruta de la imagen del enemigo
   * @param {number} ataque - Nivel de ataque del enemigo
   * @param {number} defensa - Nivel de defensa del enemigo
   * @param {number} vida - Puntos de vida del enemigo
   */
  constructor(nombre, avatar, ataque, defensa, vida) {
    this.nombre = nombre;
    this.avatar = avatar;
    this.ataque = ataque;
    this.defensa = defensa;
    this.vida = vida;
    this.vidaMaxima = vida;
  }
}