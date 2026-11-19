// SIMULADOR DE INTERFERENCIA Y DIFRACCIÓN DE ONDAS

// 1. Obtener los elementos de la página

const canvas = document.getElementById("lienzo");
const ctx = canvas.getContext("2d");

const frecuencia = document.getElementById("frecuencia");
const amplitud = document.getElementById("amplitud");
const abertura = document.getElementById("abertura");

const valorFrecuencia = document.getElementById("valorFrecuencia");
const valorAmplitud = document.getElementById("valorAmplitud");
const valorAbertura = document.getElementById("valorAbertura");

const resultadoLongitud = document.getElementById("resultadoLongitud");
const resultadoAngular = document.getElementById("resultadoAngular");

const descripcion = document.getElementById("descripcion");
const explicacion = document.getElementById("explicacion");

// 2. Definir las variables físicas

const velocidad = 120; // Velocidad en píxeles por segundo

let tiempo = 0;
let ejecutando = true;
let modo = "interferencia";

let ultimoTiempo = 0;

// Resolución interna para dibujar las ondas
const ancho = 380;
const alto = 210;

const imagen = ctx.createImageData(ancho, alto);

// 3. Actualizar los resultados físicos

function actualizarResultados() {

    const f = Number(frecuencia.value);
    const lambda = velocidad / f;
    const omega = 2 * Math.PI * f;

    valorFrecuencia.textContent = f;
    valorAmplitud.textContent = Number(amplitud.value).toFixed(1);
    valorAbertura.textContent = abertura.value;

    resultadoLongitud.textContent =
        lambda.toFixed(2) + " px";

    resultadoAngular.textContent =
        omega.toFixed(2) + " rad/s";
}

// 4. Representar la interferencia y difracción

function dibujarOndas() {

    const f = Number(frecuencia.value);
    const A = Number(amplitud.value);
    const a = Number(abertura.value);

    const lambda = velocidad / f;
    const k = 2 * Math.PI / lambda;
    const omega = 2 * Math.PI * f;

    const barreraX = 125;
    const centroY = alto / 2;

    const fuentes = 15;

    for (let py = 0; py < alto; py++) {

        for (let px = 0; px < ancho; px++) {

            let onda = 0;

            const x = px * 2;
            const y = py * 2;

            if (modo === "interferencia") {

                // Dos fuentes de ondas

                const fuente1 = Math.hypot(
                    x - 100,
                    y - (centroY * 2 - 55)
                );

                const fuente2 = Math.hypot(
                    x - 100,
                    y - (centroY * 2 + 55)
                );

                onda = (
                    Math.sin(k * fuente1 - omega * tiempo) +
                    Math.sin(k * fuente2 - omega * tiempo)
                ) / 2;

            } else {

                // Ondas incidentes antes de la abertura

                if (x < barreraX * 2) {

                    onda = Math.sin(
                        k * (x - barreraX * 2) -
                        omega * tiempo
                    );

                } else {

                    // Ondas secundarias después de la abertura

                    let suma = 0;

                    for (let i = 0; i < fuentes; i++) {

                        const posicionY =
                            centroY * 2 - a / 2 +
                            (a * i / (fuentes - 1));

                        const distancia = Math.hypot(
                            x - barreraX * 2,
                            y - posicionY
                        );

                        suma += Math.sin(
                            k * distancia - omega * tiempo
                        );
                    }

                    onda = suma / fuentes;
                }
            }

            onda = Math.max(-1, Math.min(1, onda));

            // 5. Asignar colores a las ondas

            const intensidad = Math.abs(onda);
            const indice = (py * ancho + px) * 4;

            if (onda >= 0) {

                imagen.data[indice] = 12 + intensidad * 30;
                imagen.data[indice + 1] = 45 + intensidad * 150;
                imagen.data[indice + 2] = 75 + intensidad * 180;

            } else {

                imagen.data[indice] = 3;
                imagen.data[indice + 1] = 12 + intensidad * 35;
                imagen.data[indice + 2] = 30 + intensidad * 100;
            }

            imagen.data[indice + 3] = 255;
        }
    }

    // 6. Mostrar la imagen en el lienzo

    const temporal = document.createElement("canvas");
    temporal.width = ancho;
    temporal.height = alto;

    temporal.getContext("2d").putImageData(imagen, 0, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
        temporal,
        0, 0, ancho, alto,
        0, 0, canvas.width, canvas.height
    );

    // 7. Dibujar la barrera y su abertura

    if (modo === "difraccion") {

        const centro = canvas.height / 2;
        const aberturaReal = a * 2;

        ctx.fillStyle = "#a8c5d8";

        ctx.fillRect(
            250, 0, 12,
            centro - aberturaReal / 2
        );

        ctx.fillRect(
            250,
            centro + aberturaReal / 2,
            12,
            canvas.height
        );

        ctx.fillStyle = "#ffffff";
        ctx.font = "14px Arial";
        ctx.fillText("Abertura", 265, centro + 5);
    }
}

// 8. Seleccionar el fenómeno de interferencia

document.getElementById("btnInterferencia")
    .addEventListener("click", () => {

        modo = "interferencia";

        descripcion.textContent =
            "Observa cómo dos ondas se encuentran y se superponen.";

        explicacion.textContent =
            "La interferencia constructiva ocurre cuando las ondas se encuentran en fase. La destructiva ocurre cuando están en oposición de fase.";

        dibujarOndas();
    });

// 9. Seleccionar el fenómeno de difracción

document.getElementById("btnDifraccion")
    .addEventListener("click", () => {

        modo = "difraccion";

        descripcion.textContent =
            "Observa cómo las ondas atraviesan una abertura y se expanden.";

        explicacion.textContent =
            "La difracción se observa cuando las ondas atraviesan una abertura. Es más pronunciada cuando el ancho de la abertura es comparable o menor que la longitud de onda.";

        dibujarOndas();
    });

// 10. Controles de la animación

document.getElementById("iniciar")
    .addEventListener("click", () => {

        ejecutando = true;
    });

document.getElementById("pausar")
    .addEventListener("click", () => {

        ejecutando = false;
    });

document.getElementById("reiniciar")
    .addEventListener("click", () => {

        tiempo = 0;
        ejecutando = true;
        actualizarResultados();
        dibujarOndas();
    });

// 11. Actualizar cuando cambien los controles

frecuencia.addEventListener("input", () => {
    actualizarResultados();
    dibujarOndas();
});

amplitud.addEventListener("input", () => {
    actualizarResultados();
    dibujarOndas();
});

abertura.addEventListener("input", () => {
    actualizarResultados();
    dibujarOndas();
});

// 12. Animación de las ondas

function animar(marcaTiempo) {

    if (!ultimoTiempo) {
        ultimoTiempo = marcaTiempo;
    }

    const delta = Math.min(
        (marcaTiempo - ultimoTiempo) / 1000,
        0.05
    );

    ultimoTiempo = marcaTiempo;

    if (ejecutando) {

        tiempo += delta;

        dibujarOndas();
    }

    requestAnimationFrame(animar);
}

// 13. Iniciar el simulador

actualizarResultados();
dibujarOndas();

requestAnimationFrame(animar);