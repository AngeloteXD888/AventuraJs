import { Jugador } from './clases/Jugador.js';
import { Enemigo } from './clases/Enemigo.js';
import { Jefe } from './clases/Jefe.js';
import { productos, aplicarDescuentoMasivo } from './modulos/Mercado.js';
import { combate } from './modulos/Batalla.js';
import { distinguirJugador } from './modulos/Ranking.js';
import { showScene, randomElement } from './utils.js';
import { RAREZA } from './constants.js';

// Al inicio de main.js, después de los imports
console.log("✅ Módulos cargados correctamente");
console.log("Jugador:", typeof Jugador);
console.log("Productos:", productos);
console.log("Utils:", typeof showScene);

// Verificar que el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
  console.log("✅ DOM cargado");
  inicializarJuego();
});

// Variables globales del juego
let jugador;
let enemigos;
let enemigoActualIndex = 0;
let productosActuales = [];
let carritoCompra = [];

/**
 * Inicializa el juego
 */
function inicializarJuego() {
  // Crear jugador
  jugador = new Jugador('Paco', './img/characters/13.png', 100);
  
  // Crear enemigos
  enemigos = [
    new Enemigo('Pathfinder', './img/enemigos/Pathfinder.png', 10, 50),
    new Enemigo('Octane', './img/enemigos/Octane.jpg', 15, 70),
    new Enemigo('Caustic', './img/enemigos/Caustic.png', 20, 90),
    new Jefe('Revenant', './img/enemigos/Revenant.png', 30, 120)
  ];
  
  enemigoActualIndex = 0;
  carritoCompra = [];
  
  mostrarEscena1();
}

/**
 * Muestra la escena 1 (inicio)
 */
function mostrarEscena1() {
  showScene('scene-1');
  
  // Mostrar info del jugador
  document.getElementById('player-name').textContent = jugador.nombre;
  document.getElementById('player-avatar').src = jugador.avatar;
  document.getElementById('stat-attack').textContent = `Ataque: ${jugador.obtenerAtaqueTotal()}`;
  document.getElementById('stat-defense').textContent = `Defensa: ${jugador.obtenerDefensaTotal()}`;
  document.getElementById('stat-life').textContent = `Vida: ${jugador.obtenerVidaTotal()}`;
  
  // Limpiar inventario visual
  document.getElementById('inventory-container').innerHTML = '';
  
  // Botón continuar - CORREGIDO
  const btnScene1 = document.getElementById('btn-scene-1');
  btnScene1.onclick = mostrarEscena2;
  
  // También añadir event listener para mayor compatibilidad
  btnScene1.addEventListener('click', mostrarEscena2);
}

/**
 * Muestra la escena 2 (mercado)
 */
function mostrarEscena2() {
  showScene('scene-2');

  console.log("Productos disponibles:", productos); 
  console.log("RAREZA:", RAREZA); 
  // Aplicar descuento aleatorio a una rareza
  const rarezas = Object.values(RAREZA);
  const rarezaDescuento = randomElement(rarezas);
  productosActuales = aplicarDescuentoMasivo('rareza', rarezaDescuento, 20);
  console.log("Productos con descuento:", productosActuales);
  
  // Mostrar mensaje de descuento
  document.getElementById('discount-message').textContent = 
    `¡20% de descuento en productos ${rarezaDescuento}!`;
  
  // Renderizar productos
  const productContainer = document.getElementById('product-container');
  productContainer.innerHTML = '';
  
  productosActuales.forEach((producto, index) => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.id = `product-${index}`;
    
    productCard.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p>Tipo: ${producto.tipo}</p>
      <p>Bonus: +${producto.bonus}</p>
      <p>Rareza: ${producto.rareza}</p>
      <p class="price">${producto.formatearPrecio()}</p>
      <button class="btn-add" data-index="${index}">Añadir</button>
    `;
    
    productContainer.appendChild(productCard);
  });
  
  // Event listeners para botones de añadir
  document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      toggleProducto(index, e.target);
    });
  });
  
  // Limpiar cesta visual
  document.getElementById('cart-container').innerHTML = '';
  
  // Botón continuar
  document.getElementById('btn-scene-2').onclick = () => {
    // Añadir productos del carrito al inventario
    carritoCompra.forEach(producto => jugador.añadirObjeto(producto));
    mostrarEscena3();
  };
}

/**
 * Añade o quita un producto del carrito
 */
function toggleProducto(index, button) {
  const producto = productosActuales[index];
  const productCard = document.getElementById(`product-${index}`);
  
  const indexEnCarrito = carritoCompra.findIndex(p => p.nombre === producto.nombre);
  
  if (indexEnCarrito === -1) {
    // Añadir al carrito
    carritoCompra.push(producto);
    productCard.classList.add('selected');
    button.textContent = 'Retirar';
    button.classList.add('btn-remove');
    
    // Añadir a la cesta visual
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.id = `cart-${index}`;
    cartItem.innerHTML = `<img src="${producto.imagen}" alt="${producto.nombre}">`;
    document.getElementById('cart-container').appendChild(cartItem);
  } else {
    // Quitar del carrito
    carritoCompra.splice(indexEnCarrito, 1);
    productCard.classList.remove('selected');
    button.textContent = 'Añadir';
    button.classList.remove('btn-remove');
    
    // Quitar de la cesta visual
    document.getElementById(`cart-${index}`).remove();
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
  document.getElementById('stat-attack-3').textContent = `Ataque: ${jugador.obtenerAtaqueTotal()}`;
  document.getElementById('stat-defense-3').textContent = `Defensa: ${jugador.obtenerDefensaTotal()}`;
  document.getElementById('stat-life-3').textContent = `Vida: ${jugador.obtenerVidaTotal()}`;
  
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
 * Muestra la escena 4 (enemigos)
 */
function mostrarEscena4() {
  showScene('scene-4');
  
  // Mostrar todos los enemigos
  const enemyContainer = document.getElementById('enemy-container');
  enemyContainer.innerHTML = '';
  
  enemigos.forEach((enemigo, index) => {
    const enemyCard = document.createElement('div');
    enemyCard.className = 'enemy-card';
    
    const esJefe = enemigo instanceof Jefe;
    
    enemyCard.innerHTML = `
      <img src="${enemigo.avatar}" alt="${enemigo.nombre}">
      <h3>${enemigo.nombre} ${esJefe ? '(JEFE)' : ''}</h3>
      <p>Ataque: ${enemigo.ataque}</p>
      <p>Vida: ${enemigo.vidaMaxima}</p>
      ${esJefe ? `<p>Multiplicador: x${enemigo.multiplicadorDano}</p>` : ''}
    `;
    
    enemyContainer.appendChild(enemyCard);
  });
  
  // Botón iniciar batallas
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
    resultDiv.className = 'victory';
    
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
    resultDiv.className = 'defeat';
    
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
    rankDisplay.className = 'rank-veteran';
  } else {
    rankDisplay.className = 'rank-novice';
  }
  
  // Botón reiniciar
  document.getElementById('btn-restart').onclick = () => {
    inicializarJuego();
  };
}

// Iniciar el juego cuando cargue la página
window.addEventListener('DOMContentLoaded', inicializarJuego);

