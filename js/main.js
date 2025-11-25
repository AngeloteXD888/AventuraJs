import { Jugador } from './clases/Jugador.js';
import { Enemigo } from './clases/Enemigo.js';
import { Jefe } from './clases/Jefe.js';
import { combate } from './modulos/Batalla.js';
import { distinguirJugador } from './modulos/Ranking.js';
import { showScene, randomElement, formatearPrecio } from './utils.js';
import { RAREZA } from './constants.js';

// Variables globales del juego
let jugador;
let enemigos = [];
let enemigoActualIndex = 0;
let carritoCompra = [];

/**
 * Inicializa el juego
 */
function inicializarJuego() {
  // Crear jugador
  jugador = new Jugador('Paco', './img/avatar/Avatar.png', 100);
  
  // Cargar enemigos desde el HTML
  cargarEnemigosDesdeHTML();
  
  enemigoActualIndex = 0;
  carritoCompra = [];
  
  mostrarEscena1();
}

/**
 * Carga los enemigos desde los elementos HTML
 */
function cargarEnemigosDesdeHTML() {
  enemigos = [];
  const enemyCards = document.querySelectorAll('#enemy-container .enemy-card');
  
  enemyCards.forEach(card => {
    const nombre = card.dataset.nombre;
    const avatar = card.querySelector('img').src;
    const ataque = parseInt(card.dataset.ataque);
    const vida = parseInt(card.dataset.vida);
    const esJefe = card.dataset.esJefe === 'true';
    
    if (esJefe) {
      const multiplicador = parseFloat(card.dataset.multiplicador);
      enemigos.push(new Jefe(nombre, avatar, ataque, vida, multiplicador));
    } else {
      enemigos.push(new Enemigo(nombre, avatar, ataque, vida));
    }
  });
}

/**
 * Muestra la escena 1 (inicio)
 */
function mostrarEscena1() {
  showScene('scene-1');
  
  // Mostrar info del jugador
  document.getElementById('player-name').textContent = jugador.nombre;
  document.getElementById('player-avatar').src = jugador.avatar;
  actualizarEstadisticas('');
  
  // Limpiar inventario visual
  document.getElementById('inventory-container').innerHTML = '';
  
  // Botón continuar
  document.getElementById('btn-scene-1').onclick = mostrarEscena2;
}

/**
 * Actualiza las estadísticas del jugador en pantalla
 * @param {string} sufijo - Sufijo del ID (vacío, '-3', etc)
 */
function actualizarEstadisticas(sufijo) {
  document.getElementById(`stat-attack${sufijo}`).textContent = 
    `Ataque: ${jugador.obtenerAtaqueTotal()}`;
  document.getElementById(`stat-defense${sufijo}`).textContent = 
    `Defensa: ${jugador.obtenerDefensaTotal()}`;
  document.getElementById(`stat-life${sufijo}`).textContent = 
    `Vida: ${jugador.obtenerVidaTotal()}`;
}

/**
 * Muestra la escena 2 (mercado)
 */
function mostrarEscena2() {
  showScene('scene-2');
  
  // Aplicar descuento aleatorio a una rareza
  const rarezas = Object.values(RAREZA);
  const rarezaDescuento = randomElement(rarezas);
  
  aplicarDescuentoHTML(rarezaDescuento, 20);
  
  // Mostrar mensaje de descuento
  document.getElementById('discount-message').textContent = 
    `¡20% de descuento en productos ${rarezaDescuento}!`;
  
  // Event listeners para botones de añadir
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach(card => {
    const button = card.querySelector('.btn-add');
    button.onclick = () => toggleProducto(card);
    
    // Resetear estado visual
    card.classList.remove('selected');
    button.textContent = 'Añadir';
    button.classList.remove('btn-remove');
  });
  
  // Limpiar cesta visual
  document.getElementById('cart-container').innerHTML = '';
  carritoCompra = [];
  
  // Botón continuar
  document.getElementById('btn-scene-2').onclick = () => {
    // Añadir productos del carrito al inventario
    carritoCompra.forEach(producto => jugador.añadirObjeto(producto));
    mostrarEscena3();
  };
}

/**
 * Aplica descuento a productos de una rareza en el HTML
 * @param {string} rareza - Rareza a descontar
 * @param {number} descuento - Porcentaje de descuento
 */
function aplicarDescuentoHTML(rareza, descuento) {
  const productCards = document.querySelectorAll('.product-card');
  
  productCards.forEach(card => {
    const rarezaCard = card.dataset.rareza;
    const precioOriginal = parseInt(card.dataset.precio);
    
    let precioFinal = precioOriginal;
    if (rarezaCard === rareza) {
      precioFinal = Math.round(precioOriginal * (1 - descuento / 100));
    }
    
    // Actualizar precio en el HTML
    card.querySelector('.precio-value').textContent = formatearPrecio(precioFinal);
    
    // Guardar precio aplicado en un data attribute
    card.dataset.precioActual = precioFinal;
  });
}

/**
 * Añade o quita un producto del carrito
 * @param {HTMLElement} card - Elemento HTML de la tarjeta de producto
 */
function toggleProducto(card) {
  const button = card.querySelector('.btn-add');
  const imgSrc = card.querySelector('img').src;
  
  // Crear objeto producto desde los datos del HTML
  const producto = {
    nombre: card.dataset.nombre,
    imagen: imgSrc,
    precio: parseInt(card.dataset.precioActual || card.dataset.precio),
    rareza: card.dataset.rareza,
    tipo: card.dataset.tipo,
    bonus: parseInt(card.dataset.bonus)
  };
  
  const indexEnCarrito = carritoCompra.findIndex(p => p.nombre === producto.nombre);
  
  if (indexEnCarrito === -1) {
    // Añadir al carrito
    carritoCompra.push(producto);
    card.classList.add('selected');
    button.textContent = 'Retirar';
    button.classList.add('btn-remove');
    
    // Añadir a la cesta visual
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.dataset.nombre = producto.nombre;
    cartItem.innerHTML = `<img src="${producto.imagen}" alt="${producto.nombre}">`;
    document.getElementById('cart-container').appendChild(cartItem);
  } else {
    // Quitar del carrito
    carritoCompra.splice(indexEnCarrito, 1);
    card.classList.remove('selected');
    button.textContent = 'Añadir';
    button.classList.remove('btn-remove');
    
    // Quitar de la cesta visual
    const cartItem = document.querySelector(`#cart-container .cart-item[data-nombre="${producto.nombre}"]`);
    if (cartItem) cartItem.remove();
  }
}

/**
 * Muestra la escena 3 (estado actualizado)
 */
function mostrarEscena3() {
  showScene('scene-3');
  
  // Mostrar estadísticas actualizadas
  document.getElementById('player-name-3').textContent = jugador.nombre;
  document.getElementById('player-avatar-3').src = jugador.avatar;
  actualizarEstadisticas('-3');
  
  // Mostrar inventario
  const inventoryDisplay = document.getElementById('inventory-display');
  inventoryDisplay.innerHTML = '';
  
  jugador.inventario.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'inventory-item';
    itemDiv.innerHTML = `<img src="${item.imagen}" alt="${item.nombre}">`;
    inventoryDisplay.appendChild(itemDiv);
  });
  
  // Botón continuar
  document.getElementById('btn-scene-3').onclick = mostrarEscena4;
}

/**
 * Muestra la escena 4 (enemigos) - ya están en el HTML
 */
function mostrarEscena4() {
  showScene('scene-4');
  
  // Los enemigos ya están renderizados en el HTML
  // Solo configuramos el botón
  document.getElementById('btn-scene-4').onclick = iniciarBatalla;
}

/**
 * Inicia la batalla con el enemigo actual
 */
function iniciarBatalla() {
  if (enemigoActualIndex >= enemigos.length) {
    mostrarEscenaFinal();
    return;
  }
  
  const enemigo = enemigos[enemigoActualIndex];
  const resultado = combate(enemigo, jugador);
  
  mostrarEscena5(enemigo, resultado);
}

/**
 * Muestra la escena 5 (batalla)
 */
function mostrarEscena5(enemigo, resultado) {
  showScene('scene-5');
  
  // Mostrar info de la batalla
  document.getElementById('battle-enemy-name').textContent = enemigo.nombre;
  document.getElementById('battle-enemy-avatar').src = enemigo.avatar;
  
  // Mostrar log del combate
  const battleLog = document.getElementById('battle-log');
  battleLog.innerHTML = '';
  
  resultado.log.forEach(linea => {
    const p = document.createElement('p');
    p.textContent = linea;
    battleLog.appendChild(p);
  });
  
  // Mostrar resultado
  const resultDiv = document.getElementById('battle-result');
  if (resultado.ganador === 'jugador') {
    resultDiv.innerHTML = `
      <h2>¡VICTORIA!</h2>
      <p>Has ganado ${resultado.puntosObtenidos} puntos</p>
      <p>Puntos totales: ${jugador.puntos}</p>
    `;
    resultDiv.className = 'battle-result victory';
    
    // Botón continuar a siguiente batalla
    const btnContinue = document.getElementById('btn-scene-5');
    btnContinue.textContent = 'Continuar';
    btnContinue.onclick = () => {
      enemigoActualIndex++;
      iniciarBatalla();
    };
  } else {
    resultDiv.innerHTML = `
      <h2>DERROTA</h2>
      <p>Has sido derrotado...</p>
      <p>Puntos totales: ${jugador.puntos}</p>
    `;
    resultDiv.className = 'battle-result defeat';
    
    // Botón ir al final
    const btnContinue = document.getElementById('btn-scene-5');
    btnContinue.textContent = 'Ver resultado final';
    btnContinue.onclick = mostrarEscenaFinal;
  }
}

/**
 * Muestra la escena final
 */
function mostrarEscenaFinal() {
  showScene('scene-6');
  
  const rango = distinguirJugador(jugador.puntos);
  
  document.getElementById('final-points').textContent = jugador.puntos;
  document.getElementById('final-rank').textContent = rango;
  
  // Estilo según rango
  const rankDisplay = document.getElementById('final-rank');
  if (rango === 'Veterano') {
    rankDisplay.className = 'final-rank rank-veteran';
  } else {
    rankDisplay.className = 'final-rank rank-novice';
  }
  
  // Botón reiniciar
  document.getElementById('btn-restart').onclick = () => {
    inicializarJuego();
  };
}

// Iniciar el juego cuando cargue la página
window.addEventListener('DOMContentLoaded', inicializarJuego);