/**
 * Clase que representa al jugador
 */
export class Jugador {
  /**
   * Constructor del jugador
   * @param {string} nombre - Nombre del jugador
   * @param {string} avatar - Ruta de la imagen del avatar
   * @param {number} vida - Vida inicial del jugador
   */
  constructor(nombre, avatar, vida = 100) {
    this.nombre = nombre;
    this.avatar = avatar;
    this.puntos = 0;
    this.inventario = [];
    this.vida = vida;
    this.vidaMaxima = vida;
  }

  /**
   * Añade un objeto al inventario (clonándolo)
   * @param {Producto} producto - Producto a añadir
   */
  añadirObjeto(producto) {
    const productoClonado = JSON.parse(JSON.stringify(producto));
    this.inventario.push(productoClonado);
  }

  /**
   * Suma puntos al jugador
   * @param {number} cantidad - Puntos a sumar
   */
  sumarPuntos(cantidad) {
    this.puntos += cantidad;
  }

  /**
   * Calcula el ataque total sumando bonus de armas
   * @returns {number} Ataque total
   */
  obtenerAtaqueTotal() {
    return this.inventario
      .filter(item => item.tipo === 'Arma')
      .reduce((total, item) => total + item.bonus, 0);
  }

  /**
   * Calcula la defensa total sumando bonus de armaduras
   * @returns {number} Defensa total
   */
  obtenerDefensaTotal() {
    return this.inventario
      .filter(item => item.tipo === 'Armadura')
      .reduce((total, item) => total + item.bonus, 0);
  }

  /**
   * Calcula la vida total sumando bonus de consumibles
   * @returns {number} Vida total
   */
  obtenerVidaTotal() {
    const bonusVida = this.inventario
      .filter(item => item.tipo === 'Consumible')
      .reduce((total, item) => total + item.bonus, 0);
    return this.vidaMaxima + bonusVida;
  }
}