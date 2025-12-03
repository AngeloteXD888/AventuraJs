import { Jugador } from './clases/Jugador.js';
import { Producto } from './clases/Producto.js';
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
  jugador = new Jugador('Crypto', './img/avatar/Avatar.png', 100);
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
    const defensa = parseInt(card.dataset.defensa);
    const vida = parseInt(card.dataset.vida);
    const esJefe = card.dataset.esJefe === 'true';
    
    if (esJefe) {
      const multiplicador = parseFloat(card.dataset.multiplicador);
      enemigos.push(new Jefe(nombre, avatar, ataque, defensa, vida, multiplicador));
    } else {
      enemigos.push(new Enemigo(nombre, avatar, ataque, defensa, vida));
    }
  });
}

/**
 * Muestra la escena 1 (inicio)
 */
function mostrarEscena1() {
  showScene('scene-1');
  
  document.getElementById('player-name').textContent = jugador.nombre;
  document.getElementById('player-avatar').src = jugador.avatar;
  actualizarEstadisticas('');
  
  document.getElementById('inventory-container').innerHTML = '';
  
  const btn1 = document.getElementById('btn-scene-1');
  btn1.onclick = function() {
    mostrarEscena2();
  };
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
  
  const rarezas = Object.values(RAREZA);
  const rarezaDescuento = randomElement(rarezas);
  
  aplicarDescuentoHTML(rarezaDescuento, 20);
  
  document.getElementById('discount-message').textContent = 
    `¡20% de descuento en productos ${rarezaDescuento}!`;
  
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach(card => {
    const button = card.querySelector('.btn-add');
    button.onclick = function() {
      toggleProducto(card);
    };
    
    card.classList.remove('selected');
    button.textContent = 'Añadir';
    button.classList.remove('btn-remove');
  });
  
  document.getElementById('cart-container').innerHTML = '';
  carritoCompra = [];
  
    const btn2 = document.getElementById('btn-scene-2');
  btn2.onclick = function() {
    if (carritoCompra.length === 0) {
      alert('¡Debes comprar al menos un artículo antes de continuar!');
      return;
    }
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
    
    card.querySelector('.precio-value').textContent = formatearPrecio(precioFinal);
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
  
  const producto = new Producto(
  card.dataset.nombre,
  imgSrc,
  parseInt(card.dataset.precio),
  card.dataset.rareza,
  card.dataset.tipo,
  parseInt(card.dataset.bonus)
);
  
  const indexEnCarrito = carritoCompra.findIndex(p => p.nombre === producto.nombre);
  
  if (indexEnCarrito === -1) {
    carritoCompra.push(producto);
    card.classList.add('selected');
    button.textContent = 'Retirar';
    button.classList.add('btn-remove');
    
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.dataset.nombre = producto.nombre;
    cartItem.innerHTML = `<img src="${producto.imagen}" alt="${producto.nombre}">`;
    document.getElementById('cart-container').appendChild(cartItem);
  } else {
    carritoCompra.splice(indexEnCarrito, 1);
    card.classList.remove('selected');
    button.textContent = 'Añadir';
    button.classList.remove('btn-remove');
    
    const cartItem = document.querySelector(`#cart-container .cart-item[data-nombre="${producto.nombre}"]`);
    if (cartItem) cartItem.remove();
  }
}

/**
 * Muestra la escena 3 (estado actualizado)
 */
function mostrarEscena3() {
  showScene('scene-3');
  
  document.getElementById('player-name-3').textContent = jugador.nombre;
  document.getElementById('player-avatar-3').src = jugador.avatar;
  actualizarEstadisticas('-3');
  
  const inventoryDisplay = document.getElementById('inventory-display');
  inventoryDisplay.innerHTML = '';
  
  jugador.inventario.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'inventory-item';
    itemDiv.innerHTML = `<img src="${item.imagen}" alt="${item.nombre}">`;
    inventoryDisplay.appendChild(itemDiv);
  });
  
  const btn3 = document.getElementById('btn-scene-3');
  btn3.onclick = function() {
    mostrarEscena4();
  };
}

/**
 * Muestra la escena 4 (enemigos)
 */
function mostrarEscena4() {
  showScene('scene-4');
  
  const btn4 = document.getElementById('btn-scene-4');
  btn4.onclick = function() {
    enemigoActualIndex = 0;
    iniciarBatalla();
  };
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
 * Muestra la escena 5 (batalla) con animaciones
 * @param {Enemigo} enemigo - Enemigo actual
 * @param {Object} resultado - Resultado del combate
 */
function mostrarEscena5(enemigo, resultado) {
  showScene('scene-5');
  
  // REINICIAR ANIMACIONES: Remover y volver a añadir las clases
  const fighterPlayer = document.querySelector('.fighter-player');
  const fighterEnemy = document.querySelector('.fighter-enemy');
  
  // Remover las clases de animación
  fighterPlayer.classList.remove('fighter-player');
  fighterEnemy.classList.remove('fighter-enemy');
  
  // Forzar reflujo del DOM para reiniciar la animación
  void fighterPlayer.offsetWidth;
  void fighterEnemy.offsetWidth;
  
  // Volver a añadir las clases de animación
  fighterPlayer.classList.add('fighter-player');
  fighterEnemy.classList.add('fighter-enemy');
  
  // Mostrar nombre del enemigo
  document.getElementById('battle-enemy-name').textContent = enemigo.nombre;
  document.getElementById('battle-enemy-name-display').textContent = enemigo.nombre;
  
  // Mostrar avatar del enemigo
  document.getElementById('battle-enemy-avatar').src = enemigo.avatar;
  
  // Mostrar estadísticas del enemigo
  document.getElementById('battle-enemy-attack').textContent = enemigo.ataque;
  document.getElementById('battle-enemy-defense').textContent = enemigo.defensa;
  document.getElementById('battle-enemy-life').textContent = enemigo.vidaMaxima;
  
  // Mostrar información del jugador
  document.getElementById('battle-player-avatar').src = jugador.avatar;
  document.getElementById('battle-player-name').textContent = jugador.nombre;
  document.getElementById('battle-player-attack').textContent = jugador.obtenerAtaqueTotal();
  document.getElementById('battle-player-defense').textContent = jugador.obtenerDefensaTotal();
  document.getElementById('battle-player-life').textContent = jugador.obtenerVidaTotal();
  
  // Mostrar log de batalla
  const battleLog = document.getElementById('battle-log');
  battleLog.innerHTML = '';
  battleLog.scrollTop = 0; // Resetear scroll del log
  
  resultado.log.forEach(linea => {
    const p = document.createElement('p');
    p.textContent = linea;
    battleLog.appendChild(p);
  });
  
  // Resetear scroll de la escena también
  const scene5 = document.getElementById('scene-5');
  scene5.scrollTop = 0;
  
  // Mostrar resultado
  const resultDiv = document.getElementById('battle-result');
  if (resultado.ganador === 'jugador') {
    resultDiv.innerHTML = `
      <h2>¡VICTORIA!</h2>
      <p>Has ganado ${resultado.puntosObtenidos} puntos</p>
      <p>Puntos totales: ${jugador.puntos}</p>
    `;
    resultDiv.className = 'battle-result victory';
    
    const btnContinue = document.getElementById('btn-scene-5');
    btnContinue.textContent = 'Continuar';
    btnContinue.onclick = function() {
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
    
    const btnContinue = document.getElementById('btn-scene-5');
    btnContinue.textContent = 'Ver resultado final';
    btnContinue.onclick = function() {
      mostrarEscenaFinal();
    };
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
  
  const rankDisplay = document.getElementById('final-rank');
  if (rango === 'Veterano') {
    rankDisplay.className = 'final-rank rank-veteran';
  } else {
    rankDisplay.className = 'final-rank rank-novice';
  }
  
  const btnRestart = document.getElementById('btn-restart');
  btnRestart.onclick = function() {
    inicializarJuego();
  };

if (rango === 'Veterano') {
  confetti({
    particleCount: 600,
    spread: 150,
    origin: { y: 0.6 }
  });
}
}



// Iniciar el juego cuando cargue la página
window.addEventListener('DOMContentLoaded', inicializarJuego);