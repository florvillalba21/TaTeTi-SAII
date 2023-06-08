document.addEventListener("DOMContentLoaded", function () {
  tf.ready().then(() => {
    const modelPath = "ttt_model.json";
    tf.tidy(() => {
      tf.loadLayersModel(modelPath).then((model) => {
        // Función para realizar una jugada de la IA
        function jugarIA(tablero) {
          const tensorTablero = tf.tensor(tablero);
          const result = model.predict(tensorTablero.reshape([1, 9]));
          const jugada = result.argMax(1).arraySync()[0];
          return jugada;
        }

        // Función para procesar la jugada del usuario
        function procesarJugada(jugada) {
          // Actualizar el estado del tablero y mostrarlo en la UI
          tablero[jugada] = -1;
          document.getElementById(`cell-${jugada}`).textContent = "X";

          // Verificar si hay ganador o empate
          if (hayGanador(tablero, -1)) {
            mostrarMensaje("¡Ganaste!");
            reiniciarJuego();
            return;
          } else if (tableroLleno(tablero)) {
            mostrarMensaje("¡Empate!");
            reiniciarJuego();
            return;
          }

          // Realizar jugada de la IA
          const jugadaIA = jugarIA(tablero);

          // Actualizar el estado del tablero y mostrarlo en la UI
          tablero[jugadaIA] = 1;
          document.getElementById(`cell-${jugadaIA}`).textContent = "O";

          // Verificar si hay ganador o empate
          if (hayGanador(tablero, 1)) {
            mostrarMensaje("¡Perdiste!");
            reiniciarJuego();
            return;
          } else if (tableroLleno(tablero)) {
            mostrarMensaje("¡Empate!");
            reiniciarJuego();
            return;
          }
        }

        // Función para verificar si hay un ganador
        function hayGanador(tablero, jugador) {
          const combinacionesGanadoras = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8], // filas
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8], // columnas
            [0, 4, 8],
            [2, 4, 6], // diagonales
          ];

          for (let combinacion of combinacionesGanadoras) {
            if (
              tablero[combinacion[0]] === jugador &&
              tablero[combinacion[1]] === jugador &&
              tablero[combinacion[2]] === jugador
            ) {
              return true;
            }
          }

          return false;
        }

        // Función para verificar si el tablero está lleno
        function tableroLleno(tablero) {
          return tablero.every((celda) => celda !== 0);
        }

        // Función para mostrar un mensaje en el DOM
        function mostrarMensaje(mensaje) {
          const mensajeElem = document.createElement("p");
          mensajeElem.textContent = mensaje;
          document.body.appendChild(mensajeElem);
        }

        // Función para reiniciar el juego
        function reiniciarJuego() {
          tablero = [0, 0, 0, 0, 0, 0, 0, 0, 0];
          const celdas = document.getElementsByTagName("td");
          for (let i = 0; i < celdas.length; i++) {
            celdas[i].textContent = "";
          }
        }

        // Manejar eventos de clic en las celdas del tablero
        let tablero = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        const celdas = document.getElementsByTagName("td");
        for (let i = 0; i < celdas.length; i++) {
          celdas[i].addEventListener("click", function () {
            if (tablero[i] === 0) {
              procesarJugada(i);
            }
          });
        }
      });
    });
  });
});
