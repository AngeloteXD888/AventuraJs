/**
 * Clase que representa al jugador
 */
export class Jugador {
  /**
   * Constructor del jugador
   * @param {string} nombre - Nombre del jugador
   * @param {string} avatar - Ruta de la imagen del avatar
   * @param {number} vida - Vida inicial del jugador
   * @param {number} ataque - Ataque base del jugador
   * @param {number} defensa - Defensa base del jugador
   */
  constructor(nombre, avatar, vida = 100, ataque = 0, defensa = 0) {
    this.nombre = nombre;
    this.avatar = avatar;
    this.puntos = 0;
    this.inventario = [];
    this.vida = vida;
    this.vidaMaxima = vida;
    this.ataqueBase = ataque;
    this.defensaBase = defensa;
    this.dinero = 5000; // Nueva propiedad dinero (50€ = 5000 céntimos)
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
   * Añade dinero al jugador
   * @param {number} cantidad - Dinero a añadir
   */
  añadirDinero(cantidad) {
    this.dinero += cantidad;
  }

  /**
   * Resta dinero al jugador
   * @param {number} cantidad - Dinero a restar
   * @returns {boolean} True si se pudo restar, false si no hay suficiente
   */
  restarDinero(cantidad) {
    if (this.dinero >= cantidad) {
      this.dinero -= cantidad;
      return true;
    }
    return false;
  }

  /**
   * Calcula el ataque total sumando ataque base y bonus de armas
   * @returns {number} Ataque total
   */
  obtenerAtaqueTotal() {
    const bonusArmas = this.inventario
      .filter(item => item.tipo === 'Arma')
      .reduce((total, item) => total + item.bonus, 0);
    return this.ataqueBase + bonusArmas;
  }

  /**
   * Calcula la defensa total sumando defensa base y bonus de armaduras
   * @returns {number} Defensa total
   */
  obtenerDefensaTotal() {
    const bonusArmaduras = this.inventario
      .filter(item => item.tipo === 'Armadura')
      .reduce((total, item) => total + item.bonus, 0);
    return this.defensaBase + bonusArmaduras;
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