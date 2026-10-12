/* =========================================
   SUMATE AL EQUIPO (sumate.html)
   -----------------------------------------
   1. Dibuja las tarjetas de cada área desde EQUIPO_TRABAJO (js/datos.js)
   2. Arma las opciones de campamentos y áreas del formulario
   3. Muestra el aviso según las fechas (abre el 1 de noviembre, etc.)
   4. Activa el formulario con el motor común (js/formulario.js)

   Es un PILOTO: los campos se basan en el formulario de FILO hasta
   tener el formulario real del Equipo de Trabajo.
========================================= */
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-equipo");
    if (!form) return;

    const E = EQUIPO_TRABAJO;

    /* ---------- 1. TARJETAS DE ÁREAS ---------- */
    document.getElementById("grid-areas").innerHTML = E.areas.map(area => `
        <article class="area-card" id="area-${escaparHTML(area.slug)}">
            <img src="${escaparHTML(area.imagen)}" alt="${escaparHTML(area.nombre)}" class="area-card__foto" loading="lazy">
            <div class="area-card__cuerpo">
                <h3 class="area-card__titulo">${escaparHTML(area.nombre)}</h3>
                <p class="area-card__texto">${escaparHTML(area.descripcion)}</p>
            </div>
        </article>
    `).join("");

    // Edades mínimas: si alguna está cargada, se listan; si no, queda "a confirmar"
    const conEdad = E.campamentos.filter(c => c.edadMinima);
    if (conEdad.length) {
        document.getElementById("edades-minimas").textContent =
            "Edades mínimas: " + conEdad.map(c => `${c.nombre}: ${c.edadMinima} años`).join(" · ") + ".";
    }

    /* ---------- 2. OPCIONES DEL FORMULARIO ---------- */
    const opcion = (tipo, nombre, valor, texto) =>
        `<label class="opcion"><input type="${tipo}" name="${nombre}" value="${escaparHTML(valor)}"><span>${escaparHTML(texto)}</span></label>`;

    document.getElementById("opciones-campamentos-equipo").innerHTML =
        E.campamentos.map(c => opcion("checkbox", "campamentos", c.slug,
            c.edadMinima ? `${c.nombre} (desde ${c.edadMinima} años)` : c.nombre)).join("");

    document.getElementById("opciones-area").innerHTML =
        E.areas.map(a => opcion("radio", "area", a.slug, a.nombre)).join("");

    document.getElementById("opciones-otras-areas").innerHTML =
        E.areas.map(a => opcion("checkbox", "otras_areas", a.slug, a.nombre)).join("") +
        `<label class="opcion"><input type="checkbox" name="otras_areas" value="ninguna" data-exclusivo><span>Solo la que elegí</span></label>`;

    // El área elegida como principal no tiene sentido como "otra área": la deshabilitamos
    form.addEventListener("change", (e) => {
        if (e.target.name !== "area") return;
        form.querySelectorAll('input[name="otras_areas"]').forEach(input => {
            const esLaPrincipal = input.value === e.target.value;
            input.disabled = esLaPrincipal;
            if (esLaPrincipal) input.checked = false;
            input.closest(".opcion").classList.toggle("opcion--deshabilitada", esLaPrincipal);
        });
    });

    /* ---------- 3. ESTADO DE LAS INSCRIPCIONES ---------- */
    const estado = estadoVisible(E.inscripcion);
    if (!mostrarAvisoDeEstado(form, estado, E.inscripcion)) return;

    /* ---------- 4. ACTIVAR EL FORMULARIO ---------- */
    iniciarFormulario(form, {
        reglas: {
            referente_celular: (v) => /^\d{8,13}$/.test(soloNumeros(v)) || "Revisá el número: escribilo con código de área, sin el 0 ni el 15.",
            fecha_nacimiento: (v) => {
                const edad = (Date.now() - new Date(v + "T12:00:00")) / (365.25 * 24 * 60 * 60 * 1000);
                return (edad >= 14 && edad <= 90) || "Revisá la fecha de nacimiento.";
            }
        },
        armar: (d, visible) => {
            const texto = (nombre) => (d.get(nombre) || "").trim() || null;
            return {
                formulario: "equipo-trabajo",
                temporada: E.nombre,
                nombre: texto("nombre"),
                apellido: texto("apellido"),
                fecha_nacimiento: d.get("fecha_nacimiento"),
                dni: soloNumeros(d.get("dni")),
                celular: soloNumeros(d.get("celular")),
                email: texto("email")?.toLowerCase() ?? null,
                campamentos: d.getAll("campamentos"),
                area: d.get("area"),
                otras_areas: d.getAll("otras_areas").filter(a => a !== "ninguna"),
                sirvio_antes: d.get("sirvio_antes") === "si",
                experiencia: visible("experiencia") ? texto("experiencia") : null,
                iglesia: texto("iglesia"),
                referente_nombre: texto("referente_nombre"),
                referente_vinculo: texto("referente_vinculo"),
                referente_celular: soloNumeros(d.get("referente_celular")),
                dieta: d.get("dieta"),
                dieta_detalle: visible("dieta_detalle") ? texto("dieta_detalle") : null,
                comentarios: texto("comentarios"),
                lista_espera: estado === "lista-espera"
            };
        }
    });
});
