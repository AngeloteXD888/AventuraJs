/**
 * Funciones de utilidad genéricas
 */

/**
 * Muestra u oculta un elemento (escena) de la pantalla
 * @param {number} id - identificador del elemento
 */
/**
 * Muestra u oculta un elemento (escena) de la pantalla con transición
 * @param {string} id - identificador del elemento
 */
export function showScene(id) {
  const currentScene = document.querySelector('.scene.active');
  const nextScene = document.getElementById(id);
  
  if (currentScene) {
    // Añadir clase de salida a la escena actual
    currentScene.classList.add('exiting');
    
    // Esperar a que termine la animación de salida
    setTimeout(() => {
      currentScene.classList.remove('active', 'exiting');
      
      // Mostrar la nueva escena
      nextScene.classList.add('active');
      
      // Hacer scroll hacia arriba suavemente
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300); // Duración de la animación de salida
  } else {
    // Si no hay escena activa, mostrar directamente
    nextScene.classList.add('active');
  }
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