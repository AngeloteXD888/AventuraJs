import { Producto } from '../clases/Producto.js';
import { RAREZA, TIPO_PRODUCTO } from '../constants.js';

/**
 * Listado de productos disponibles en el mercado
 */
export const productos = [
  // Armas
  new Producto('Mozambique', './img/items/Mozambique.png', 500, RAREZA.COMUN, TIPO_PRODUCTO.ARMA, 5),
  new Producto('Eva8', './img/items/Eva8.png', 800, RAREZA.RARA, TIPO_PRODUCTO.ARMA, 8),
  new Producto('R-301', './img/items/R-301.png', 1200, RAREZA.EPICA, TIPO_PRODUCTO.ARMA, 12),
  new Producto('Reliquia', './img/items/Relquia.png', 2000, RAREZA.LEGENDARIA, TIPO_PRODUCTO.ARMA, 20),
  
  // Armaduras
  new Producto('Armadura Normal', './img/items/Armadura_Común.png', 400, RAREZA.COMUN, TIPO_PRODUCTO.ARMADURA, 4),
  new Producto('Armadura Rara', './img/items/Armadura_Rara.png', 700, RAREZA.RARA, TIPO_PRODUCTO.ARMADURA, 7),
  new Producto('Armadura Épica', './img/items/Armadura_Epica.png', 1000, RAREZA.EPICA, TIPO_PRODUCTO.ARMADURA, 10),
  new Producto('Armadura Legendaria', './img/items/Aramadura_Legendaria.png', 1800, RAREZA.LEGENDARIA, TIPO_PRODUCTO.ARMADURA, 18),
  
  // Consumibles
  new Producto('Botiquin', './img/items/Curacion.png', 300, RAREZA.COMUN, TIPO_PRODUCTO.CONSUMIBLE, 10),
  new Producto('Baterias de escudo', './img/items/Escudos.png', 400, RAREZA.COMUN, TIPO_PRODUCTO.ARMADURA, 10),
  new Producto('Kit-Fenix', './img/items/Kit_Fenix.jpg', 1500, RAREZA.LEGENDARIA, TIPO_PRODUCTO.CONSUMIBLE, 50)
];

/**
 * Filtra productos por rareza
 * @param {string} rareza - Rareza a filtrar
 * @returns {Array<Producto>} Productos filtrados
 */
export function filtrarPorRareza(rareza) {
  return productos.filter(producto => producto.rareza === rareza);
}

/**
 * Aplica un descuento a productos de un tipo o rareza específica
 * @param {string} criterio - 'tipo' o 'rareza'
 * @param {string} valor - Valor del tipo o rareza
 * @param {number} descuento - Porcentaje de descuento
 * @returns {Array<Producto>} Productos con descuento aplicado
 */
export function aplicarDescuentoMasivo(criterio, valor, descuento) {
  return productos.map(producto => {
    if (criterio === 'tipo' && producto.tipo === valor) {
      return producto.aplicarDescuento(descuento);
    } else if (criterio === 'rareza' && producto.rareza === valor) {
      return producto.aplicarDescuento(descuento);
    }
    return producto;
  });
}

/**
 * Busca un producto por nombre
 * @param {string} nombre - Nombre del producto a buscar
 * @returns {Producto|null} Producto encontrado o null
 */
export function buscarProducto(nombre) {
  return productos.find(producto => 
    producto.nombre.toLowerCase() === nombre.toLowerCase()
  ) || null;
}