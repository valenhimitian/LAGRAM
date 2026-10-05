/* =========================================
   FORMULARIO DE INSCRIPCIÓN (10 a 18)
   -----------------------------------------
   1. Arma la info de la temporada y las opciones desde js/datos.js
   2. Maneja los 4 pasos (Continuar / Anterior)
   3. Muestra u oculta campos según otras respuestas
   4. Valida cada paso antes de avanzar
   5. Arma el objeto final y lo manda con enviarInscripcion() (js/api.js)
========================================= */
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-inscripcion");
    if (!form) return;

    const pasos = [...form.querySelectorAll(".formulario__paso")];
    const btnAnterior = document.getElementById("btn-anterior");
    const btnSiguiente = document.getElementById("btn-siguiente");
    const btnEnviar = document.getElementById("btn-enviar");
    const errorGeneral = document.getElementById("error-general");
    let pasoActual = 0;

    // Campamentos que se pueden elegir en este formulario (los de TEMPORADA)
    const campamentos = TEMPORADA.campamentos.map(c => ({
        ...c,
        evento: EVENTOS.find(e => e.slug === c.slug)
    }));

    /* ---------- 1. INFO DE LA TEMPORADA ---------- */

    const formatearFecha = (iso) => iso
        ? new Date(iso + "T12:00:00").toLocaleDateString("es-AR", { day: "numeric", month: "long" })
        : "a confirmar";

    const formatearPrecio = (n) => n
        ? "$ " + n.toLocaleString("es-AR")
        : "a confirmar";

    document.getElementById("temporada-titulo").textContent = TEMPORADA.nombre;

    document.getElementById("temporada-info").innerHTML = `
        <h2 class="inscripcion-info__titulo">Todo lo que tenés que saber</h2>
        <dl class="inscripcion-info__lista">
            <div>
                <dt>¿Dónde?</dt>
                <dd>${escaparHTML(TEMPORADA.lugar)}.<br>${escaparHTML(TEMPORADA.salida)}.</dd>
            </div>
            <div>
                <dt>¿Cuándo y cuánto cuesta?</dt>
                <dd>
                    <ul class="inscripcion-info__campas">
                        ${campamentos.map(c => `
                            <li><strong>${c.edadMin} a ${c.edadMax} años</strong>
                                <span>${c.fechas ? escaparHTML(c.fechas) : "Fechas a confirmar"}</span>
                                <span>${formatearPrecio(c.costo)}</span></li>
                        `).join("")}
                    </ul>
                </dd>
            </div>
            <div>
                <dt>¿Cómo funciona?</dt>
                <dd>Te anotás del <strong>${formatearFecha(TEMPORADA.inscripcion.desde)}</strong> al
                    <strong>${formatearFecha(TEMPORADA.inscripcion.hasta)}</strong>, sin correr y sin desesperarte.
                    Después hacemos un sorteo para otorgar las vacantes y te avisamos por WhatsApp al celular de tu adulto responsable.
                    Si quedaste, tenés <strong>${TEMPORADA.diasParaPagar} días</strong> para pagar y confirmar tu lugar.</dd>
            </div>
            <div>
                <dt>¿Más preguntas?</dt>
                <dd>Escribinos al <a href="https://wa.me/${TEMPORADA.contacto.replace(/\D/g, "")}" target="_blank" rel="noopener">${escaparHTML(TEMPORADA.contacto)}</a></dd>
            </div>
        </dl>
    `;

    /* ---------- ESTADO DE LA TEMPORADA ---------- */

    const avisoEstado = document.getElementById("aviso-estado");
    if (TEMPORADA.estado === "cerrada") {
        avisoEstado.innerHTML = "<p>Las inscripciones de esta temporada están cerradas. ¡Seguinos en las redes para enterarte de la próxima!</p>";
        avisoEstado.hidden = false;
        form.hidden = true;
        return;
    }
    if (TEMPORADA.estado === "lista-espera") {
        avisoEstado.innerHTML = "<p><strong>¡Importante!</strong> La fecha de inscripción ya terminó, pero todavía podés anotarte: vas a entrar automáticamente a la lista de espera y te contactamos si se libera un cupo.</p>";
        avisoEstado.hidden = false;
    }

    /* ---------- 2. OPCIONES DE CAMPAMENTO Y EDAD ---------- */

    const contenedorCampas = document.getElementById("opciones-campamento");
    contenedorCampas.innerHTML = campamentos.map((c, i) => `
        <label class="opcion">
            <input type="radio" name="campamento" value="${c.slug}" ${i === 0 ? "required" : ""}>
            <span>${escaparHTML(c.evento ? c.evento.titulo : c.slug)}</span>
        </label>
    `).join("");

    const selectEdad = document.getElementById("edad");
    const avisoEdad = document.getElementById("aviso-edad");

    function actualizarEdades(slug) {
        const campa = campamentos.find(c => c.slug === slug);
        if (!campa) return;

        let opciones = `<option value="">Elegí tu edad</option>
                        <option value="menor">Menos de ${campa.edadMin}</option>`;
        for (let edad = campa.edadMin; edad <= campa.edadMax; edad++) {
            opciones += `<option value="${edad}">${edad} años</option>`;
        }
        opciones += `<option value="mayor">Más de ${campa.edadMax}</option>`;

        selectEdad.innerHTML = opciones;
        selectEdad.disabled = false;
        avisoEdad.hidden = true;
    }

    contenedorCampas.addEventListener("change", (e) => actualizarEdades(e.target.value));
    selectEdad.addEventListener("change", () => {
        avisoEdad.hidden = !["menor", "mayor"].includes(selectEdad.value);
    });

    // Si viene de un botón "Inscribirme" (inscripcion.html?evento=13-15), lo dejamos elegido
    const eventoURL = new URLSearchParams(location.search).get("evento");
    if (eventoURL === "22-26") {
        document.getElementById("aviso-22-26").hidden = false;
        form.hidden = true;
        return;
    }
    const radioURL = form.querySelector(`input[name="campamento"][value="${CSS.escape(eventoURL || "")}"]`);
    if (radioURL) {
        radioURL.checked = true;
        actualizarEdades(eventoURL);
    }

    /* ---------- 3. CAMPOS CONDICIONALES ---------- */
    // data-mostrar-si="va_iglesia=si"     → se muestra si va_iglesia es "si"
    // data-mostrar-si="dieta!=ninguna"    → se muestra si dieta tiene algo distinto de "ninguna"

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
            if (!mostrar) limpiarError(campo);
        });
    }
    form.addEventListener("change", actualizarCondicionales);

    /* ---------- 4. VALIDACIÓN ---------- */

    const soloNumeros = (texto) => texto.replace(/\D/g, "");

    // Reglas extra, además de "obligatorio"
    const reglas = {
        dni: (v) => /^\d{7,8}$/.test(soloNumeros(v)) || "Revisá el DNI: tiene que tener 7 u 8 números.",
        celular: (v) => /^\d{8,13}$/.test(soloNumeros(v)) || "Revisá el número: escribilo con código de área, sin el 0 ni el 15.",
        celular_adulto: (v) => /^\d{8,13}$/.test(soloNumeros(v)) || "Revisá el número: escribilo con código de área, sin el 0 ni el 15.",
        email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Revisá el email, parece que le falta algo.",
        codigo_postal: (v) => /^(\d{4}|[a-zA-Z]\d{4}[a-zA-Z]{3})$/.test(v.trim()) || "Escribí los 4 números del código postal (ej: 1408).",
        fecha_nacimiento: (v) => {
            const fecha = new Date(v + "T12:00:00");
            const edad = (Date.now() - fecha) / (365.25 * 24 * 60 * 60 * 1000);
            return (edad >= 7 && edad <= 30) || "Revisá la fecha de nacimiento.";
        }
    };

    // Valida un bloque .campo y devuelve true si está bien
    function validarCampo(campo) {
        if (campo.hidden) return true;

        const inputs = [...campo.querySelectorAll("input, select, textarea")];
        if (inputs.length === 0) return true;

        const nombre = inputs[0].name;
        const esObligatorio = !!campo.querySelector(".campo__req") || inputs.some(i => i.required);
        let valor;

        if (inputs[0].type === "radio") {
            const elegido = inputs.find(i => i.checked);
            valor = elegido ? elegido.value : "";
        } else if (inputs[0].type === "checkbox") {
            valor = inputs[0].checked ? "si" : "";
        } else {
            valor = inputs[0].value.trim();
        }

        let mensaje = "";
        if (!valor && esObligatorio) {
            mensaje = inputs[0].type === "checkbox" ? "Necesitamos tu conformidad para enviar la inscripción."
                    : inputs[0].type === "radio" ? "Elegí una opción."
                    : "Este dato es obligatorio.";
        } else if (valor && reglas[nombre]) {
            const resultado = reglas[nombre](valor);
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

    function limpiarError(campo) { mostrarError(campo, ""); }

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
    form.addEventListener("input", (e) => {
        const campo = e.target.closest(".campo");
        if (campo && campo.classList.contains("campo--error")) validarCampo(campo);
    });
    form.addEventListener("change", (e) => {
        const campo = e.target.closest(".campo");
        if (campo && campo.classList.contains("campo--error")) validarCampo(campo);
    });

    /* ---------- 5. NAVEGACIÓN ENTRE PASOS ---------- */

    function mostrarPaso(indice) {
        pasos.forEach((paso, i) => paso.hidden = i !== indice);
        pasoActual = indice;

        const esUltimo = indice === pasos.length - 1;
        btnAnterior.hidden = indice === 0;
        btnSiguiente.hidden = esUltimo;
        btnEnviar.hidden = !esUltimo;
        errorGeneral.textContent = "";

        document.getElementById("paso-texto").textContent = `Paso ${indice + 1} de ${pasos.length}`;
        document.getElementById("paso-barra").style.width = `${((indice + 1) / pasos.length) * 100}%`;

        const y = form.getBoundingClientRect().top + window.scrollY - 110;
        window.scrollTo({ top: y, behavior: "smooth" });
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

    /* ---------- 6. ENVÍO ---------- */

    // Arma el objeto con los nombres de columna que va a tener la tabla en Supabase
    function armarInscripcion() {
        const d = new FormData(form);
        const texto = (nombre) => (d.get(nombre) || "").trim() || null;
        const visible = (nombre) => !form.querySelector(`[data-campo="${nombre}"]`).hidden;
        const edad = d.get("edad");

        return {
            temporada: TEMPORADA.nombre,
            campamento: d.get("campamento"),
            edad: /^\d+$/.test(edad) ? Number(edad) : null,
            edad_fuera_de_rango: edad === "menor" ? "menor" : edad === "mayor" ? "mayor" : null,
            nombre: texto("nombre"),
            apellido: texto("apellido"),
            sexo: d.get("sexo"),
            fecha_nacimiento: d.get("fecha_nacimiento"),
            dni: soloNumeros(d.get("dni")),
            va_iglesia: d.get("va_iglesia") === "si",
            iglesia: visible("iglesia") ? texto("iglesia") : null,
            colegio: texto("colegio"),
            dieta: d.get("dieta"),
            dieta_detalle: visible("dieta_detalle") ? texto("dieta_detalle") : null,
            experiencia: d.get("experiencia"),
            unir_con: texto("unir_con"),
            direccion: texto("direccion"),
            barrio: texto("barrio"),
            municipio: texto("municipio"),
            codigo_postal: texto("codigo_postal")?.toUpperCase() ?? null,
            celular: visible("celular") ? soloNumeros(d.get("celular")) : null,
            instagram: texto("instagram")?.replace(/^@/, "") ?? null,
            email: texto("email")?.toLowerCase() ?? null,
            celular_adulto: soloNumeros(d.get("celular_adulto")),
            comentarios: texto("comentarios"),
            lista_espera: TEMPORADA.estado === "lista-espera"
        };
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!validarPaso(pasoActual)) return;

        btnEnviar.disabled = true;
        btnEnviar.textContent = "Enviando...";
        errorGeneral.textContent = "";

        try {
            const respuesta = await enviarInscripcion(armarInscripcion());
            if (!respuesta.ok) throw new Error("Respuesta no ok");

            form.hidden = true;
            const exito = document.getElementById("formulario-exito");
            if (respuesta.modoPrueba) {
                document.getElementById("exito-texto").textContent +=
                    " (Modo prueba: esta inscripción todavía no se guarda en la base de datos.)";
            }
            exito.hidden = false;
            exito.focus();
            exito.scrollIntoView({ behavior: "smooth", block: "center" });
        } catch (error) {
            console.error(error);
            errorGeneral.textContent = "No pudimos enviar tu inscripción. Revisá tu conexión y probá de nuevo. Si sigue fallando, escribinos por WhatsApp.";
            btnEnviar.disabled = false;
            btnEnviar.textContent = "Enviar inscripción";
        }
    });

    actualizarCondicionales();
    mostrarPaso(0);
    window.scrollTo(0, 0);
});
