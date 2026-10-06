/* =========================================
   PÁGINA DE UNA PROPUESTA (evento.html?e=slug)
   -----------------------------------------
   Una sola página para todas las propuestas que no tienen formulario
   (ExpoCarreras, Picnic, Arte...). Lee el slug de la URL y arma todo
   con EVENTOS (js/datos.js) y DETALLES (js/detalles.js).

   Distingue dos casos para que nadie piense que la web está desactualizada:
   - vigente: true  → "La próxima edición todavía no tiene fecha" + la última
   - vigente: false → "Esta propuesta ya no se realiza. Te contamos cómo era."
========================================= */
document.addEventListener("DOMContentLoaded", () => {
    const encabezado = document.getElementById("evento-encabezado");
    if (!encabezado) return;

    const slug = new URLSearchParams(location.search).get("e");
    const evento = EVENTOS.find(e => e.slug === slug && e.tipo === "iniciativa");
    const detalle = evento ? DETALLES[evento.slug] : null;

    const $ = (id) => document.getElementById(id);
    const redes = `<a href="https://www.instagram.com/lagramoficial" target="_blank" rel="noopener">nuestras redes</a>`;

    function mostrarCartel(titulo, texto) {
        $("vacio-titulo").textContent = titulo;
        $("vacio-texto").innerHTML = texto;
        $("evento-vacio").hidden = false;
    }

    /* ---------- La propuesta no existe ---------- */
    if (!evento) {
        $("evento-titulo").textContent = "Página no encontrada";
        $("evento-texto").textContent = "";
        document.title = "Página no encontrada | LAGRAM";
        mostrarCartel("Esta página no existe",
            "Puede que el enlace esté mal escrito o que la página se haya movido.");
        return;
    }

    /* ---------- Encabezado ---------- */
    document.title = `${evento.titulo} | LAGRAM`;
    $("evento-titulo").textContent = evento.titulo;
    $("evento-etiqueta").textContent = evento.vigente ? "Más iniciativas" : "Propuestas que hicimos";
    // Si hay preguntas y respuestas, la descripción ya aparece abajo ("¿Qué es...?"):
    // arriba mostramos solo las edades. Si no hay, mostramos la descripción.
    $("evento-texto").textContent = detalle
        ? (evento.edades ? `Para ${evento.edades}.` : "")
        : (evento.descripcion || "");
    if (evento.imagen) {
        encabezado.style.backgroundImage = `url('${evento.imagen}')`;
    }

    /* ---------- Aviso según si se sigue haciendo o no ---------- */
    const aviso = $("evento-aviso");
    if (evento.vigente) {
        const proxima = detalle && detalle.proximaEdicion;
        aviso.innerHTML = proxima
            ? `<p><strong>Próxima edición:</strong> ${proxima}</p>`
            : `<p><strong>La próxima edición todavía no tiene fecha.</strong> Seguí ${redes} para enterarte cuándo se viene.</p>
               ${detalle && detalle.ultimaEdicion ? `<p class="inscripcion-aviso__nota">${escaparHTML(detalle.ultimaEdicion)}</p>` : ""}`;
    } else {
        const cuando = evento.ultimaEdicion ? ` Se realizó por última vez en ${escaparHTML(evento.ultimaEdicion)}.` : "";
        aviso.innerHTML = `<p><strong>Esta propuesta ya no se realiza.</strong>${cuando} ${detalle ? "Te contamos cómo era." : ""}</p>
                           ${detalle && detalle.ultimaEdicion ? `<p class="inscripcion-aviso__nota">${escaparHTML(detalle.ultimaEdicion)}</p>` : ""}`;
    }
    aviso.hidden = false;

    /* ---------- Sin información cargada ---------- */
    if (!detalle) {
        mostrarCartel("Todavía no tenemos más información",
            `${escaparHTML(evento.titulo)} es parte de la historia de LAGRAM. Si querés saber más, escribinos por
             <a href="https://wa.me/5491163765990" target="_blank" rel="noopener">WhatsApp</a> o en ${redes}.`);
        return;
    }

    /* ---------- Preguntas y respuestas ---------- */
    const secciones = [...detalle.secciones];
    if (evento.vigente) {
        secciones.push({
            pregunta: "¿Qué hago si tengo más preguntas?",
            respuesta: `<p>Escribinos al <a href="https://wa.me/5491163765990" target="_blank" rel="noopener">+54 9 11 6376-5990</a></p>`
        });
    }

    const info = $("evento-info");
    info.innerHTML = `
        <dl class="inscripcion-info__lista">
            ${secciones.map(s => `
                <div>
                    <dt>${escaparHTML(s.pregunta)}</dt>
                    <dd>${s.respuesta}</dd>
                </div>
            `).join("")}
        </dl>
    `;
    info.hidden = false;
});
