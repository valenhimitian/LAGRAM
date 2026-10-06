/* =========================================
   INSCRIPCIÓN A CAMPAMENTOS (10 a 18)
   -----------------------------------------
   Lo particular de este formulario:
   1. Info de la temporada y opciones de campamento desde js/datos.js
   2. Lista de edades según el campamento elegido
   3. Cómo se arma el objeto que se guarda

   Los pasos, la validación y el envío los hace js/formulario.js
========================================= */
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-inscripcion");
    if (!form) return;

    // Campamentos que se pueden elegir en este formulario (los de TEMPORADA)
    const campamentos = TEMPORADA.campamentos.map(c => ({
        ...c,
        evento: EVENTOS.find(e => e.slug === c.slug)
    }));

    /* ---------- 1. INFO DE LA TEMPORADA ---------- */

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
                <dd>${TEMPORADA.inscripcion.desde && TEMPORADA.inscripcion.hasta
                        ? `Te anotás del <strong>${formatearFecha(TEMPORADA.inscripcion.desde)}</strong> al
                           <strong>${formatearFecha(TEMPORADA.inscripcion.hasta)}</strong>, sin correr y sin desesperarte.`
                        : `Te anotás desde esta página en las fechas de inscripción, que vamos a anunciar en nuestras redes.`}
                    Después hacemos un sorteo para otorgar las vacantes y te avisamos por WhatsApp al celular de tu adulto responsable.
                    Si quedaste, tenés <strong>${TEMPORADA.diasParaPagar} días</strong> para pagar y confirmar tu lugar.</dd>
            </div>
            <div>
                <dt>¿Más preguntas?</dt>
                <dd>Escribinos al <a href="https://wa.me/${TEMPORADA.contacto.replace(/\D/g, "")}" target="_blank" rel="noopener">${escaparHTML(TEMPORADA.contacto)}</a></dd>
            </div>
        </dl>
    `;

    /* ---------- ESTADO DE LAS INSCRIPCIONES ---------- */
    // Se calcula con las fechas de TEMPORADA.inscripcion (ver js/script.js)

    const estado = estadoVisible(TEMPORADA.inscripcion);
    if (!mostrarAvisoDeEstado(form, estado, TEMPORADA.inscripcion)) return;

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

    /* ---------- 3. ACTIVAR EL FORMULARIO ---------- */

    iniciarFormulario(form, {
        reglas: {
            // Para los campamentos de chicos, una edad fuera de 7-30 años es un error de tipeo
            fecha_nacimiento: (v) => {
                const edad = (Date.now() - new Date(v + "T12:00:00")) / (365.25 * 24 * 60 * 60 * 1000);
                return (edad >= 7 && edad <= 30) || "Revisá la fecha de nacimiento.";
            }
        },
        // Arma el objeto con los nombres de columna que va a tener la tabla en Supabase
        armar: (d, visible) => {
            const texto = (nombre) => (d.get(nombre) || "").trim() || null;
            const edad = d.get("edad");

            return {
                formulario: "campamentos",
                temporada: TEMPORADA.nombre,
                campamento: d.get("campamento"),
                edad: /^\d+$/.test(edad) ? Number(edad) : null,
                edad_fuera_de_rango: edad === "menor" || edad === "mayor" ? edad : null,
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
                lista_espera: estado === "lista-espera"
            };
        }
    });
});
