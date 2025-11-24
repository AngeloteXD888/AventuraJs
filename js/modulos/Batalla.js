import { PUNTUACION_BASE } from '../constants.js';
import { Jefe } from '../clases/Jefe.js';

/**
 * Simula un combate por turnos entre jugador y enemigo
 * @param {Enemigo} enemigo - Enemigo a combatir
 * @param {Jugador} jugador - Jugador que combate
 * @returns {Object} Resultado del combate {ganador, puntosObtenidos, log}
 */
export function combate(enemigo, jugador) {
  // Reiniciar vida del jugador antes del combate
  jugador.vida = jugador.obtenerVidaTotal();
  enemigo.vida = enemigo.vidaMaxima;
  
  const ataqueJugador = jugador.obtenerAtaqueTotal();
  const defensaJugador = jugador.obtenerDefensaTotal();
  const ataqueEnemigo = enemigo.ataque;
  
  const log = [];
  let turno = 1;
  
  // Combate por turnos
  while (jugador.vida > 0 && enemigo.vida > 0) {
    log.push(`--- Turno ${turno} ---`);
    
    // Ataque del jugador
    const danoAlEnemigo = ataqueJugador;
    enemigo.vida -= danoAlEnemigo;
    log.push(`${jugador.nombre} ataca a ${enemigo.nombre} y causa ${danoAlEnemigo} de daño.`);
    log.push(`Vida de ${enemigo.nombre}: ${Math.max(0, enemigo.vida)} / ${enemigo.vidaMaxima}`);
    
    if (enemigo.vida <= 0) {
      log.push(`¡${enemigo.nombre} ha sido derrotado!`);
      break;
    }
    
    // Ataque del enemigo
    const danoAlJugador = Math.max(0, ataqueEnemigo - defensaJugador);
    jugador.vida -= danoAlJugador;
    log.push(`${enemigo.nombre} ataca a ${jugador.nombre} y causa ${danoAlJugador} de daño.`);
    log.push(`Vida de ${jugador.nombre}: ${Math.max(0, jugador.vida)} / ${jugador.obtenerVidaTotal()}`);
    
    if (jugador.vida <= 0) {
      log.push(`${jugador.nombre} ha sido derrotado...`);
      break;
    }
    
    turno++;
  }
  
  // Determinar ganador y calcular puntos
  let ganador, puntosObtenidos;
  
  if (jugador.vida > 0) {
    ganador = 'jugador';
    puntosObtenidos = PUNTUACION_BASE + ataqueEnemigo;
    
    // Si es un jefe, multiplicar los puntos
    if (enemigo instanceof Jefe) {
      puntosObtenidos = Math.round(puntosObtenidos * enemigo.multiplicadorDano);
      log.push(`¡Has derrotado a un JEFE! Puntos x${enemigo.multiplicadorDano}`);
    }
    
    jugador.sumarPuntos(puntosObtenidos);
    log.push(`Has ganado ${puntosObtenidos} puntos.`);
  } else {
    ganador = 'enemigo';
    puntosObtenidos = 0;
  }
  
  return {
    ganador,
    puntosObtenidos,
    log
  };
}