import { formatearPrecio } from '../utils.js';

/**
 * Clase que representa un producto del mercado
 */
export class Producto {
  /**
   * Constructor del producto
   * @param {string} nombre - Nombre del producto
   * @param {string} imagen - Ruta de la imagen del producto
   * @param {number} precio - Precio en céntimos
   * @param {string} rareza - Rareza del producto (Común, Rara, Épica, Legendaria)
   * @param {string} tipo - Tipo (Arma, Armadura, Consumible)
   * @param {number} bonus - Valor del bonus que otorga
   */
  constructor(nombre, imagen, precio, rareza, tipo, bonus) {
    this.nombre = nombre;
    this.imagen = imagen;
    this.precio = precio;
    this.rareza = rareza;
    this.tipo = tipo;
    this.bonus = bonus;
  }

  /**
   * Formatea el precio a formato euro
   * @returns {string} Precio formateado
   */
  formatearPrecio() {
    return formatearPrecio(this.precio);
  }

  /**
   * Aplica un descuento y devuelve una copia del producto con el nuevo precio
   * @param {number} descuento - Descuento en porcentaje (ej: 20 para 20%)
   * @returns {Producto} Clon del producto con precio modificado
   */
  aplicarDescuento(descuento) {
    const productoClonado = JSON.parse(JSON.stringify(this));
    productoClonado.precio = Math.round(productoClonado.precio * (1 - descuento / 100));
    return productoClonado;
  }
}