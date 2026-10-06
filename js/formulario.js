/* =========================================
   MOTOR DE FORMULARIOS (común a todas las inscripciones)
   -----------------------------------------
   Cualquier formulario de inscripción del sitio usa esta función.
   Se encarga de lo que todos tienen en común:

   1. Pasos (Continuar / Anterior) y barra de progreso
   2. Campos que aparecen según otras respuestas (data-mostrar-si)
   3. Validación de cada paso antes de avanzar
   4. Envío con enviarInscripcion() (js/api.js) y pantalla de éxito

   Lo particular de cada formulario (qué campos tiene, cómo se arma
   el objeto final) va en su propio archivo:
   - js/inscripcion-campamentos.js
   - js/inscripcion-filo.js

   Convenciones del HTML:
   - Cada pregunta va dentro de <div class="campo" data-campo="nombre_del_campo">
   - Si es obligatoria, lleva <span class="campo__req">*</span> en el label
   - data-mostrar-si="dieta=otra"     → se muestra solo si dieta es "otra"
   - data-mostrar-si="dieta!=ninguna" → se muestra si dieta tiene otro valor
   - Un checkbox con data-exclusivo desmarca a los demás del grupo (ej: "Ninguna")
========================================= */

const soloNumeros = (texto) => String(texto || "").replace(/\D/g, "");

// Formatos más comunes. Cada formulario puede sumar los suyos.
const REGLAS_COMUNES = {
    dni: (v) => /^\d{7,8}$/.test(soloNumeros(v)) || "Revisá el DNI: tiene que tener 7 u 8 números.",
    celular: (v) => /^\d{8,13}$/.test(soloNumeros(v)) || "Revisá el número: escribilo con código de área, sin el 0 ni el 15.",
    celular_adulto: (v) => /^\d{8,13}$/.test(soloNumeros(v)) || "Revisá el número: escribilo con código de área, sin el 0 ni el 15.",
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Revisá el email, parece que le falta algo.",
    codigo_postal: (v) => /^(\d{4}|[a-zA-Z]\d{4}[a-zA-Z]{3})$/.test(v.trim()) || "Escribí los 4 números del código postal (ej: 1408).",
    fecha_nacimiento: (v) => {
        const fecha = new Date(v + "T12:00:00");
        const edad = (Date.now() - fecha) / (365.25 * 24 * 60 * 60 * 1000);
        return (edad >= 7 && edad <= 100) || "Revisá la fecha de nacimiento.";
    }
};

function formatearFecha(iso) {
    return iso
        ? new Date(iso + "T12:00:00").toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })
        : "a confirmar";
}

function formatearPrecio(numero) {
    return numero ? "$ " + numero.toLocaleString("es-AR") : "a confirmar";
}

/**
 * Arma el cuadro "Todo lo que tenés que saber" de un campamento,
 * con el mismo texto que tenía la página original de LAGRAM.
 * Lo que no está cargado en js/datos.js se muestra como "a confirmar".
 *
 * @param {object} c
 * @param {string} c.lugar, c.salida
 * @param {Array<{edades, fechas, costo}>} c.filas  una fila por campamento
 * @param {{desde, hasta}} c.inscripcion
 * @param {string|null} c.aviso       fecha desde la que se avisa quién quedó
 * @param {number} c.diasParaPagar
 * @param {string} c.contacto
 * @param {string} c.avisoA           a qué número se avisa ("al número que indiques...")
 */
function infoCampamento(c) {
    const dia = (iso) => new Date(iso + "T12:00:00").toLocaleDateString("es-AR", { day: "numeric", month: "long" });
    const { desde, hasta } = c.inscripcion;
    const varios = c.filas.length > 1;

    const cuando = c.filas.map(f => f.fechas
        ? `${varios ? escaparHTML(f.edades) + " - " : "El campamento es del "}<strong>${escaparHTML(f.fechas)}</strong>`
        : `${varios ? escaparHTML(f.edades) + " - " : ""}Fechas a confirmar`).join("<br>");

    const costo = c.filas.map(f => {
        if (varios) return `${escaparHTML(f.edades)} - <strong>${formatearPrecio(f.costo)}</strong>`;
        return f.costo ? `El costo es de <strong>${formatearPrecio(f.costo)}</strong>` : "Costo a confirmar";
    }).join("<br>");

    // "1 al 5 de julio" si es el mismo mes; si no, "28 de junio al 3 de julio"
    const rango = (a, b) => {
        const [ma, mb] = [a.slice(5, 7), b.slice(5, 7)];
        return ma === mb ? `${Number(a.slice(8))} al ${dia(b)}` : `${dia(a)} al ${dia(b)}`;
    };

    const inscribo = desde && hasta
        ? `<p>Del <strong>${rango(desde, hasta)}</strong> vas a poder anotarte, sin correr y sin desesperarte.</p>
           <p>Completá el formulario de esta página con tu información personal y de contacto.</p>
           <p>Después del ${dia(hasta)} vamos a juntar la información de todos los que se anotaron y hacer un sorteo para otorgar las vacantes.</p>`
        : `<p>Cuando abran las inscripciones vas a poder anotarte, sin correr y sin desesperarte. Las fechas las vamos a anunciar en nuestras redes.</p>
           <p>Completá el formulario de esta página con tu información personal y de contacto.</p>
           <p>Al cerrar las inscripciones vamos a juntar la información de todos los que se anotaron y hacer un sorteo para otorgar las vacantes.</p>`;

    return `
        <dl class="inscripcion-info__lista">
            <div>
                <dt>¿Dónde va a ser el campamento?</dt>
                <dd><p>${c.lugar ? `El campamento va a ser en el ${escaparHTML(c.lugar)}.` : "Lugar a confirmar."}</p>
                    ${c.salida ? `<p>${escaparHTML(c.salida)}.</p>` : ""}</dd>
            </div>
            <div>
                <dt>¿Cuándo es el campamento?</dt>
                <dd><p>${cuando}</p></dd>
            </div>
            <div>
                <dt>¿Cómo me inscribo?</dt>
                <dd>${inscribo}</dd>
            </div>
            <div>
                <dt>¿Cómo sé si quedé entre los inscriptos al campamento?</dt>
                <dd>
                    <p>${c.aviso ? `A partir del <strong>${dia(c.aviso)}</strong>` : "Después del sorteo"} nos vamos a comunicar con todos los que se anotaron para avisarles si quedaron o no en la lista del campamento. Te vamos a avisar por WhatsApp ${escaparHTML(c.avisoA)} y contarte los pasos a seguir:</p>
                    <ul class="inscripcion-info__puntos">
                        <li>Vas a tener <strong>${c.diasParaPagar} días</strong> para realizar e informar el pago y así confirmar tu vacante.</li>
                        <li>Si después de ese tiempo no informaste tu pago, tu inscripción será cancelada y elegiremos al azar a alguien que no entró para ofrecerle la vacante.</li>
                    </ul>
                </dd>
            </div>
            <div>
                <dt>¿Cuál es el costo?</dt>
                <dd><p>${costo}</p></dd>
            </div>
            <div>
                <dt>¿Qué hago si tengo más preguntas?</dt>
                <dd><p>Escribinos al <a href="https://wa.me/${soloNumeros(c.contacto)}" target="_blank" rel="noopener">${escaparHTML(c.contacto)}</a></p></dd>
            </div>
        </dl>
    `;
}

/**
 * Muestra el aviso que corresponde al estado de la inscripción y oculta el
 * formulario si no se puede anotar. Devuelve true si el formulario queda visible.
 * Necesita un <div id="aviso-estado" hidden> en la página.
 */
function mostrarAvisoDeEstado(form, estado, ventana) {
    const aviso = document.getElementById("aviso-estado");
    const redes = `<a href="https://www.instagram.com/lagramoficial" target="_blank" rel="noopener">nuestras redes</a>`;
    let html = "";

    if (estado === "proximamente") {
        html = ventana.desde
            ? `<p><strong>Las inscripciones abren el ${formatearFecha(ventana.desde)}.</strong>
               Mientras tanto, podés leer toda la info y seguir ${redes} para no perderte nada.</p>`
            : `<p><strong>Las inscripciones todavía no están abiertas.</strong>
               Seguí ${redes} para enterarte cuándo abren.</p>`;
    } else if (estado === "cerrada") {
        html = `<p><strong>Las inscripciones están cerradas.</strong> ¡Seguí ${redes} para enterarte de lo que viene!</p>`;
    } else if (estado === "lista-espera") {
        html = `<p><strong>¡Importante!</strong> La fecha de inscripción ya terminó, pero todavía podés anotarte:
                vas a entrar automáticamente a la lista de espera y te contactamos si se libera un cupo.</p>`;
    }

    aviso.innerHTML = html;
    aviso.hidden = !html;

    const sePuedeAnotar = estado === "abierta" || estado === "lista-espera";
    form.hidden = !sePuedeAnotar;
    return sePuedeAnotar;
}

/**
 * Activa un formulario de inscripción.
 * @param {HTMLFormElement} form
 * @param {object} opciones
 * @param {function(FormData, function): object} opciones.armar  arma el objeto que se envía
 * @param {object} [opciones.reglas]  validaciones extra por nombre de campo
 */
function iniciarFormulario(form, { armar, reglas = {} }) {
    const pasos = [...form.querySelectorAll(".formulario__paso")];
    const btnAnterior = form.querySelector("[data-accion='anterior']");
    const btnSiguiente = form.querySelector("[data-accion='siguiente']");
    const btnEnviar = form.querySelector("[data-accion='enviar']");
    const errorGeneral = form.querySelector(".formulario__error-general");
    const progreso = form.querySelector(".formulario__progreso");
    const todasLasReglas = { ...REGLAS_COMUNES, ...reglas };
    let pasoActual = 0;

    /* ---------- CAMPOS CONDICIONALES ---------- */

    const condicionales = [...form.querySelectorAll("[data-mostrar-si]")];

    function actualizarCondicionales() {
        const datos = new FormData(form);
        condicionales.forEach(campo => {
            const regla = campo.dataset.mostrarSi;
            const distinto = regla.includes("!=");
            const [nombre, valor] = regla.split(distinto ? "!=" : "=");
            const actual = datos.get(nombre);
            const mostrar = distinto ? (actual !== null && actual !== valor) : actual === valor;

            campo.hidden = !mostrar;
            if (!mostrar) mostrarError(campo, "");
        });
    }

    /* ---------- CHECKBOX EXCLUSIVO ("Ninguna") ---------- */

    form.addEventListener("change", (e) => {
        const input = e.target;
        if (input.type !== "checkbox" || !input.checked) return;
        const grupo = [...form.querySelectorAll(`input[type="checkbox"][name="${input.name}"]`)];
        if (input.hasAttribute("data-exclusivo")) {
            grupo.filter(i => i !== input).forEach(i => i.checked = false);
        } else {
            grupo.filter(i => i.hasAttribute("data-exclusivo")).forEach(i => i.checked = false);
        }
    });

    /* ---------- VALIDACIÓN ---------- */

    function leerValor(inputs) {
        const primero = inputs[0];
        if (primero.type === "radio") {
            const elegido = inputs.find(i => i.checked);
            return elegido ? elegido.value : "";
        }
        if (primero.type === "checkbox") {
            return inputs.filter(i => i.checked).map(i => i.value).join(",");
        }
        return primero.value.trim();
    }

    // Valida un bloque .campo y devuelve true si está bien
    function validarCampo(campo) {
        if (campo.hidden) return true;

        const inputs = [...campo.querySelectorAll("input, select, textarea")];
        if (inputs.length === 0) return true;

        const primero = inputs[0];
        const esObligatorio = !!campo.querySelector(".campo__req") || inputs.some(i => i.required);
        const valor = leerValor(inputs);

        let mensaje = "";
        if (!valor && esObligatorio) {
            if (primero.type === "checkbox" && inputs.length === 1) mensaje = "Necesitamos tu conformidad para enviar la inscripción.";
            else if (primero.type === "checkbox") mensaje = "Elegí al menos una opción.";
            else if (primero.type === "radio") mensaje = "Elegí una opción.";
            else mensaje = "Este dato es obligatorio.";
        } else if (valor && todasLasReglas[primero.name]) {
            const resultado = todasLasReglas[primero.name](valor);
            if (resultado !== true) mensaje = resultado;
        }

        mostrarError(campo, mensaje);
        return !mensaje;
    }

    function mostrarError(campo, mensaje) {
        campo.classList.toggle("campo--error", !!mensaje);
        const p = campo.querySelector(".campo__error");
        if (p) p.textContent = mensaje;
        campo.querySelectorAll("input, select, textarea").forEach(i => {
            if (mensaje) i.setAttribute("aria-invalid", "true");
            else i.removeAttribute("aria-invalid");
        });
    }

    function validarPaso(indice) {
        const campos = [...pasos[indice].querySelectorAll(".campo")];
        const resultados = campos.map(validarCampo);   // validamos todos para marcar todos los errores
        const primerError = campos.find((c, i) => !resultados[i]);
        if (primerError) {
            const input = primerError.querySelector("input, select, textarea");
            if (input) input.focus();
            return false;
        }
        return true;
    }

    // Si un campo tenía error, lo revalidamos apenas el usuario lo corrige
    ["input", "change"].forEach(evento => {
        form.addEventListener(evento, (e) => {
            const campo = e.target.closest(".campo");
            if (campo && campo.classList.contains("campo--error")) validarCampo(campo);
        });
    });
    form.addEventListener("change", actualizarCondicionales);

    /* ---------- PASOS ---------- */

    function mostrarPaso(indice, desplazar = true) {
        pasos.forEach((paso, i) => paso.hidden = i !== indice);
        pasoActual = indice;

        const esUltimo = indice === pasos.length - 1;
        btnAnterior.hidden = indice === 0;
        btnSiguiente.hidden = esUltimo;
        btnEnviar.hidden = !esUltimo;
        errorGeneral.textContent = "";

        if (progreso) {
            progreso.hidden = pasos.length === 1;
            progreso.querySelector(".formulario__paso-texto").textContent = `Paso ${indice + 1} de ${pasos.length}`;
            progreso.querySelector(".formulario__barra-relleno").style.width = `${((indice + 1) / pasos.length) * 100}%`;
        }

        if (desplazar) {
            const y = form.getBoundingClientRect().top + window.scrollY - 110;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    }

    btnSiguiente.addEventListener("click", () => {
        if (validarPaso(pasoActual)) mostrarPaso(pasoActual + 1);
    });
    btnAnterior.addEventListener("click", () => mostrarPaso(pasoActual - 1));

    // Enter en un campo de texto no debe enviar el formulario antes del último paso
    form.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && e.target.tagName === "INPUT" && pasoActual < pasos.length - 1) {
            e.preventDefault();
            btnSiguiente.click();
        }
    });

    /* ---------- ENVÍO ---------- */

    // Helper para el armado: devuelve el valor de un campo solo si está visible
    function visible(nombre) {
        const campo = form.querySelector(`[data-campo="${nombre}"]`);
        return campo && !campo.hidden;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!validarPaso(pasoActual)) return;

        const textoBoton = btnEnviar.textContent;
        btnEnviar.disabled = true;
        btnEnviar.textContent = "Enviando...";
        errorGeneral.textContent = "";

        try {
            const respuesta = await enviarInscripcion(armar(new FormData(form), visible));
            if (!respuesta.ok) throw new Error("Respuesta no ok");

            form.hidden = true;
            const exito = document.getElementById("formulario-exito");
            if (respuesta.modoPrueba) {
                exito.querySelector("p").textContent +=
                    " (Modo prueba: esta inscripción todavía no se guarda en la base de datos.)";
            }
            exito.hidden = false;
            exito.focus();
            exito.scrollIntoView({ behavior: "smooth", block: "center" });
        } catch (error) {
            console.error(error);
            errorGeneral.textContent = "No pudimos enviar tu inscripción. Revisá tu conexión y probá de nuevo. Si sigue fallando, escribinos por WhatsApp.";
            btnEnviar.disabled = false;
            btnEnviar.textContent = textoBoton;
        }
    });

    actualizarCondicionales();
    mostrarPaso(0, false);
}
