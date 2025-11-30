/**
 * Obtiene todos los productos desde el HTML
 * @returns {Array<Object>} Array de productos
 */
export function obtenerProductosDesdeHTML() {
  const productCards = document.querySelectorAll('.product-card');
  const productos = [];
  
  productCards.forEach(card => {
    productos.push({
      nombre: card.dataset.nombre,
      imagen: card.querySelector('img').src,
      precio: parseInt(card.dataset.precio),
      rareza: card.dataset.rareza,
      tipo: card.dataset.tipo,
      bonus: parseInt(card.dataset.bonus)
    });
  });
  
  return productos;
}

/**
 * Filtra productos por rareza desde el HTML
 * @param {string} rareza - Rareza a filtrar
 * @returns {Array<Object>} Productos filtrados
 */
export function filtrarPorRareza(rareza) {
  const productCards = document.querySelectorAll('.product-card');
  const productosFiltrados = [];
  
  productCards.forEach(card => {
    if (card.dataset.rareza === rareza) {
      productosFiltrados.push({
        nombre: card.dataset.nombre,
        imagen: card.querySelector('img').src,
        precio: parseInt(card.dataset.precio),
        rareza: card.dataset.rareza,
        tipo: card.dataset.tipo,
        bonus: parseInt(card.dataset.bonus)
      });
    }
  });
  
  return productosFiltrados;
}

/**
 * Filtra productos por tipo desde el HTML
 * @param {string} tipo - Tipo a filtrar (Arma, Armadura, Consumible)
 * @returns {Array<Object>} Productos filtrados
 */
export function filtrarPorTipo(tipo) {
  const productCards = document.querySelectorAll('.product-card');
  const productosFiltrados = [];
  
  productCards.forEach(card => {
    if (card.dataset.tipo === tipo) {
      productosFiltrados.push({
        nombre: card.dataset.nombre,
        imagen: card.querySelector('img').src,
        precio: parseInt(card.dataset.precio),
        rareza: card.dataset.rareza,
        tipo: card.dataset.tipo,
        bonus: parseInt(card.dataset.bonus)
      });
    }
  });
  
  return productosFiltrados;
}

/**
 * Busca un producto por nombre en el HTML
 * @param {string} nombre - Nombre del producto a buscar
 * @returns {Object|null} Producto encontrado o null
 */
export function buscarProducto(nombre) {
  const productCards = document.querySelectorAll('.product-card');
  
  for (const card of productCards) {
    if (card.dataset.nombre.toLowerCase() === nombre.toLowerCase()) {
      return {
        nombre: card.dataset.nombre,
        imagen: card.querySelector('img').src,
        precio: parseInt(card.dataset.precio),
        rareza: card.dataset.rareza,
        tipo: card.dataset.tipo,
        bonus: parseInt(card.dataset.bonus)
      };
    }
  }
  
  return null;
}