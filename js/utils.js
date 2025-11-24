/**
 * Funciones de utilidad genéricas
 */

/**
 * Muestra u oculta un elemento (escena) de la pantalla
 * @param {number} id - identificador del elemento
 */
export function showScene(id) {
  document.querySelectorAll('.scene').forEach(
    element => element.classList.remove('active')
  );
  document.getElementById(id).classList.add('active');
}

/**
 * Selecciona un elemento aleatorio de un array
 * @param {Array} array - Array del que seleccionar
 * @returns {*} Elemento aleatorio
 */
export function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Formatea un precio en céntimos a formato euro
 * @param {number} precio - Precio en céntimos
 * @returns {string} Precio formateado (ej: "9,50€")
 */
export function formatearPrecio(precio) {
  return `${(precio / 100).toFixed(2).replace('.', ',')}€`;
}

/**
 * Clona un objeto
 * @param {Object} obj - Objeto a clonar
 * @returns {Object} Clon del objeto
 */
export function clonar(obj) {
  return JSON.parse(JSON.stringify(obj));
}