import { Jugador } from './clases/Jugador.js';
import { Producto } from './clases/Producto.js';
import { Enemigo } from './clases/Enemigo.js';
import { Jefe } from './clases/Jefe.js';
import { combate } from './modulos/Batalla.js';
import { distinguirJugador, guardarRanking, obtenerRanking, mostrarRankingConsola, inicializarRanking } from './modulos/Ranking.js';
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
  enemigoActualIndex = 0;
  carritoCompra = [];
  cargarEnemigosDesdeHTML();
  
  // IMPORTANTE: Inicializar ranking con datos por defecto
  inicializarRanking();
  
  if (jugador) {
    jugador.inventario = [];
    actualizarInventarioFooter();
  }
  
  mostrarEscena0();
  mostrarMonedero();
  actualizarMonederoInicial();
}

/**
 * Muestra u oculta el monedero
 */
function mostrarMonedero() {
  const monedero = document.getElementById('monedero');
  monedero.classList.add('show');
}

function ocultarMonedero() {
  const monedero = document.getElementById('monedero');
  monedero.classList.remove('show');
}

function actualizarMonedero() {
  document.getElementById('monedero-cantidad').textContent = formatearPrecio(jugador.dinero);
}

// Nueva función para actualizar el monedero con el valor inicial
function actualizarMonederoInicial() {
  document.getElementById('monedero-cantidad').textContent = '50,00€';
}

/**
 * Actualiza el inventario del footer
 */
function actualizarInventarioFooter() {
  const inventoryContainer = document.getElementById('inventory-container');
  inventoryContainer.innerHTML = '';
  
  // IMPORTANTE: Siempre mostrar al menos 6 celdas vacías
  const totalCeldas = Math.max(6, jugador.inventario.length);
  
  for (let i = 0; i < totalCeldas; i++) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item';
    
    if (i < jugador.inventario.length) {
      const item = jugador.inventario[i];
      itemDiv.innerHTML = `<img src="${item.imagen}" alt="${item.nombre}">`;
    }
    
    inventoryContainer.appendChild(itemDiv);
  }
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
 * ESCENA 0: FORMULARIO CREAR JUGADOR
 */
function mostrarEscena0() {
  showScene('scene-0');
  
  const form = document.getElementById('form-crear-jugador');
  const inputNombre = document.getElementById('input-nombre');
  const inputAtaque = document.getElementById('input-ataque');
  const inputDefensa = document.getElementById('input-defensa');
  const inputVida = document.getElementById('input-vida');
  const puntosRestantes = document.getElementById('puntos-restantes');
  
  // Resetear valores
  inputNombre.value = '';
  inputAtaque.value = 0;
  inputDefensa.value = 0;
  inputVida.value = 0;
  puntosRestantes.textContent = '10';
  limpiarErrores();
  
  // Botones de incrementar/decrementar
  const botonesIncrease = document.querySelectorAll('.btn-increase');
  const botonesDecrease = document.querySelectorAll('.btn-decrease');
  
  botonesIncrease.forEach(btn => {
    btn.onclick = function() {
      const targetId = this.dataset.target;
      const input = document.getElementById(targetId);
      incrementarStat(input, puntosRestantes);
    };
  });
  
  botonesDecrease.forEach(btn => {
    btn.onclick = function() {
      const targetId = this.dataset.target;
      const input = document.getElementById(targetId);
      decrementarStat(input, puntosRestantes);
    };
  });
  
  // Submit del formulario
  form.onsubmit = function(e) {
    e.preventDefault();
    
    if (validarFormulario()) {
      const nombre = inputNombre.value.trim();
      const ataque = parseInt(inputAtaque.value);
      const defensa = parseInt(inputDefensa.value);
      const vidaExtra = parseInt(inputVida.value);
      
      jugador = new Jugador(nombre, './img/avatar/Avatar.png', 100 + vidaExtra, ataque, defensa);
      
      mostrarEscena1();
    }
  };
}

/**
 * Incrementa un stat si hay puntos disponibles
 */
function incrementarStat(input, puntosDisplay) {
  const puntosActuales = parseInt(puntosDisplay.textContent);
  const valorActual = parseInt(input.value);
  
  if (puntosActuales > 0 && valorActual < 10) {
    input.value = valorActual + 1;
    puntosDisplay.textContent = puntosActuales - 1;
  }
}

/**
 * Decrementa un stat
 */
function decrementarStat(input, puntosDisplay) {
  const puntosActuales = parseInt(puntosDisplay.textContent);
  const valorActual = parseInt(input.value);
  
  if (valorActual > 0) {
    input.value = valorActual - 1;
    puntosDisplay.textContent = puntosActuales + 1;
  }
}

/**
 * Valida el formulario de creación de jugador
 */
function validarFormulario() {
  limpiarErrores();
  let esValido = true;
  
  const nombre = document.getElementById('input-nombre').value.trim();
  const ataque = parseInt(document.getElementById('input-ataque').value);
  const defensa = parseInt(document.getElementById('input-defensa').value);
  const vida = parseInt(document.getElementById('input-vida').value);
  const puntosRestantes = parseInt(document.getElementById('puntos-restantes').textContent);
  
  // Validar nombre con regex
  // Regex: primera letra mayúscula, solo letras y espacios, máximo 20 caracteres, no solo espacios
  const regexNombre = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñA-ZÁÉÍÓÚÑ\s]{0,19}$/;
  
  if (nombre === '') {
    mostrarError('error-nombre', 'El nombre es obligatorio');
    esValido = false;
  } else if (/^\s+$/.test(nombre)) {
    mostrarError('error-nombre', 'El nombre no puede contener solo espacios');
    esValido = false;
  } else if (!regexNombre.test(nombre)) {
    mostrarError('error-nombre', 'Primera letra mayúscula, solo letras y espacios, máx 20 caracteres');
    esValido = false;
  }
  
  // Validar que se hayan usado todos los puntos
  if (puntosRestantes !== 0) {
    mostrarError('error-ataque', 'Debes distribuir todos los 10 puntos');
    esValido = false;
  }
  
  // Validar que los valores sean válidos
  if (ataque < 0 || defensa < 0 || vida < 0) {
    mostrarError('error-ataque', 'Los valores no pueden ser negativos');
    esValido = false;
  }
  
  // Validar que la suma no supere 10
  if (ataque + defensa + vida > 10) {
    mostrarError('error-ataque', 'La suma total no puede superar 10 puntos');
    esValido = false;
  }
  
  return esValido;
}

function mostrarError(idError, mensaje) {
  document.getElementById(idError).textContent = mensaje;
}

function limpiarErrores() {
  const errores = document.querySelectorAll('.error-message');
  errores.forEach(error => error.textContent = '');
}

/**
 * Muestra la escena 1 (inicio)
 */
function mostrarEscena1() {
  showScene('scene-1');
  actualizarMonedero();
  
  document.getElementById('player-name').textContent = jugador.nombre;
  document.getElementById('player-avatar').src = jugador.avatar;
  
  // Actualizar estadísticas manualmente con formato correcto
  document.getElementById('stat-attack').textContent = `Ataque: ${jugador.obtenerAtaqueTotal()}`;
  document.getElementById('stat-defense').textContent = `Defensa: ${jugador.obtenerDefensaTotal()}`;
  document.getElementById('stat-life').textContent = `Vida: ${jugador.obtenerVidaTotal()}`;
  document.getElementById('stat-money').textContent = `Dinero: ${formatearPrecio(jugador.dinero)}`;
  
  actualizarInventarioFooter();
  
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
  
  // Actualizar dinero si existe el elemento
  const statMoney = document.getElementById(`stat-money${sufijo}`);
  if (statMoney) {
    statMoney.textContent = `Dinero: ${formatearPrecio(jugador.dinero)}`;
  }
}

/**
 * Muestra la escena 2 (mercado)
 */
function mostrarEscena2() {
  showScene('scene-2');
  actualizarMonedero();
  
  const rarezas = Object.values(RAREZA);
  const rarezaDescuento = randomElement(rarezas);
  
  aplicarDescuentoHTML(rarezaDescuento, 20);
  
  document.getElementById('discount-message').textContent = 
    `¡20% de descuento en productos ${rarezaDescuento}!`;
  
  actualizarDineroDisponible();
  
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
 * Actualiza el dinero disponible en el mercado
 */
function actualizarDineroDisponible() {
  const totalCarrito = calcularTotalCarrito();
  const dineroDisponible = jugador.dinero - totalCarrito;
  document.getElementById('dinero-disponible').textContent = formatearPrecio(dineroDisponible);
  
  // Deshabilitar productos que no se pueden comprar
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach(card => {
    const precioActual = parseInt(card.dataset.precioActual || card.dataset.precio);
    const estaEnCarrito = carritoCompra.some(p => p.nombre === card.dataset.nombre);
    
    if (!estaEnCarrito && precioActual > dineroDisponible) {
      card.classList.add('disabled');
      card.querySelector('.btn-add').disabled = true;
    } else if (!estaEnCarrito) {
      card.classList.remove('disabled');
      card.querySelector('.btn-add').disabled = false;
    }
  });
}

/**
 * Calcula el total del carrito
 */
function calcularTotalCarrito() {
  return carritoCompra.reduce((total, producto) => {
    return total + producto.precio;
  }, 0);
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
  const precioActual = parseInt(card.dataset.precioActual || card.dataset.precio);
  
  const producto = new Producto(
    card.dataset.nombre,
    imgSrc,
    precioActual,
    card.dataset.rareza,
    card.dataset.tipo,
    parseInt(card.dataset.bonus)
  );
  
  const indexEnCarrito = carritoCompra.findIndex(p => p.nombre === producto.nombre);
  
  if (indexEnCarrito === -1) {
    // Verificar si hay suficiente dinero
    const totalCarrito = calcularTotalCarrito();
    if (jugador.dinero - totalCarrito < precioActual) {
      alert('¡No tienes suficiente dinero para comprar este producto!');
      return;
    }
    
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
  
  // Actualizar dinero disponible después de cada cambio
  actualizarDineroDisponible();
}

/**
 * Muestra la escena 3 (estado actualizado)
 */
function mostrarEscena3() {
  // Restar el dinero gastado
  const totalGastado = calcularTotalCarrito();
  jugador.restarDinero(totalGastado);
  
  showScene('scene-3');
  actualizarMonedero();
  
  document.getElementById('player-name-3').textContent = jugador.nombre;
  document.getElementById('player-avatar-3').src = jugador.avatar;
  
  // Actualizar estadísticas manualmente con formato correcto
  document.getElementById('stat-attack-3').textContent = `Ataque: ${jugador.obtenerAtaqueTotal()}`;
  document.getElementById('stat-defense-3').textContent = `Defensa: ${jugador.obtenerDefensaTotal()}`;
  document.getElementById('stat-life-3').textContent = `Vida: ${jugador.obtenerVidaTotal()}`;
  document.getElementById('stat-money-3').textContent = `Dinero: ${formatearPrecio(jugador.dinero)}`;
  
  const inventoryDisplay = document.getElementById('inventory-display');
  inventoryDisplay.innerHTML = '';
  
  jugador.inventario.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'inventory-item';
    itemDiv.innerHTML = `<img src="${item.imagen}" alt="${item.nombre}">`;
    inventoryDisplay.appendChild(itemDiv);
  });
  
  actualizarInventarioFooter();

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
 * Muestra animación de 3 monedas cayendo tras victoria
 */
function mostrarAnimacionMonedas() {
  const monedasContainer = document.getElementById('monedas-container');
  
  // Activar la animación
  monedasContainer.classList.add('active');
  
  // Eliminar la clase después de la animación para poder reutilizarla
  setTimeout(() => {
    monedasContainer.classList.remove('active');
  }, 3500);
}

/**
 * Muestra la escena 5 (batalla) con animaciones
 * @param {Enemigo} enemigo - Enemigo actual
 * @param {Object} resultado - Resultado del combate
 */
function mostrarEscena5(enemigo, resultado) {
  showScene('scene-5');
  actualizarMonedero();
  
  // REINICIAR ANIMACIONES
  const fighterPlayer = document.querySelector('.fighter-player');
  const fighterEnemy = document.querySelector('.fighter-enemy');
  
  fighterPlayer.classList.remove('fighter-player');
  fighterEnemy.classList.remove('fighter-enemy');
  
  void fighterPlayer.offsetWidth;
  void fighterEnemy.offsetWidth;
  
  fighterPlayer.classList.add('fighter-player');
  fighterEnemy.classList.add('fighter-enemy');
  
  // Mostrar información
  document.getElementById('battle-enemy-name').textContent = enemigo.nombre;
  document.getElementById('battle-enemy-name-display').textContent = enemigo.nombre;
  document.getElementById('battle-enemy-avatar').src = enemigo.avatar;
  document.getElementById('battle-enemy-attack').textContent = enemigo.ataque;
  document.getElementById('battle-enemy-defense').textContent = enemigo.defensa;
  document.getElementById('battle-enemy-life').textContent = enemigo.vidaMaxima;
  
  document.getElementById('battle-player-avatar').src = jugador.avatar;
  document.getElementById('battle-player-name').textContent = jugador.nombre;
  document.getElementById('battle-player-attack').textContent = jugador.obtenerAtaqueTotal();
  document.getElementById('battle-player-defense').textContent = jugador.obtenerDefensaTotal();
  document.getElementById('battle-player-life').textContent = jugador.obtenerVidaTotal();
  
  // Mostrar log
  const battleLog = document.getElementById('battle-log');
  battleLog.innerHTML = '';
  battleLog.scrollTop = 0;
  
  resultado.log.forEach(linea => {
    const p = document.createElement('p');
    p.textContent = linea;
    battleLog.appendChild(p);
  });
  
  const scene5 = document.getElementById('scene-5');
  scene5.scrollTop = 0;
  
  // Mostrar resultado
  const resultDiv = document.getElementById('battle-result');
  if (resultado.ganador === 'jugador') {
    resultDiv.innerHTML = `
      <h2>¡VICTORIA!</h2>
      <p>Has ganado ${resultado.puntosObtenidos} puntos</p>
      <p>Has obtenido ${formatearPrecio(resultado.monedasObtenidas)}</p>
      <p>Puntos totales: ${jugador.puntos}</p>
      <p>Dinero total: ${formatearPrecio(jugador.dinero)}</p>
    `;
    resultDiv.className = 'battle-result victory';
    
    const btnContinue = document.getElementById('btn-scene-5');
    btnContinue.textContent = 'Continuar';
    btnContinue.onclick = function() {
      enemigoActualIndex++;
      iniciarBatalla();
    };
    
    // IMPORTANTE: Mostrar animación de monedas DESPUÉS de renderizar todo
    // Usamos setTimeout para asegurar que el DOM esté listo
    setTimeout(() => {
      mostrarAnimacionMonedas();
      console.log('Animación de monedas activada para:', enemigo.nombre, 'Es jefe:', enemigo instanceof Jefe);
    }, 100);
    
  } else {
    resultDiv.innerHTML = `
      <h2>DERROTA</h2>
      <p>Has sido derrotado...</p>
      <p>Puntos totales: ${jugador.puntos}</p>
      <p>Dinero total: ${formatearPrecio(jugador.dinero)}</p>
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
 * Muestra la escena final con ranking
 */
function mostrarEscenaFinal() {
  showScene('scene-6');
  
  // Calcular puntuación total (puntos + dinero restante en céntimos)
  const puntuacionTotal = jugador.puntos + jugador.dinero;
  const rango = distinguirJugador(puntuacionTotal);
  
  // Guardar en ranking
  guardarRanking(jugador.nombre, jugador.puntos, jugador.dinero);
  
  // Mostrar resultados
  document.getElementById('final-points').textContent = jugador.puntos;
  document.getElementById('final-money').textContent = formatearPrecio(jugador.dinero);
  document.getElementById('final-total').textContent = puntuacionTotal;
  document.getElementById('final-rank').textContent = rango;
  
  const rankDisplay = document.getElementById('final-rank');
  if (rango === 'Veterano') {
    rankDisplay.className = 'final-rank rank-veteran';
  } else {
    rankDisplay.className = 'final-rank rank-novice';
  }
  
  // Cargar y mostrar tabla de ranking
  mostrarTablaRanking();
  
  // Botón ver ranking en consola
  const btnVerRanking = document.getElementById('btn-ver-ranking');
  btnVerRanking.onclick = function() {
    mostrarRankingConsola();
  };
  
  // Botón reiniciar
  const btnRestart = document.getElementById('btn-restart');
  btnRestart.onclick = function() {
    inicializarJuego();
  };

  // Confetti solo si es veterano
  if (rango === 'Veterano') {
    confetti({
      particleCount: 600,
      spread: 150,
      origin: { y: 0.6 }
    });
  }
}

/**
 * Muestra la tabla de ranking en la escena final
 */
function mostrarTablaRanking() {
  const ranking = obtenerRanking();
  const tbody = document.getElementById('ranking-tbody');
  tbody.innerHTML = '';
  
  if (ranking.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="4">No hay registros aún</td>';
    tbody.appendChild(tr);
    return;
  }
  
  // Mostrar todos los registros (no limitar a 10)
  ranking.forEach((registro, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${registro.nombre}</td>
      <td>${registro.puntuacion}</td>
      <td>${formatearPrecio(registro.dinero)}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Iniciar el juego cuando cargue la página
window.addEventListener('DOMContentLoaded', inicializarJuego);