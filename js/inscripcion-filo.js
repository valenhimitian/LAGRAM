/* =========================================
   INSCRIPCIÓN A FILO
   -----------------------------------------
   Lo particular de este formulario:
   1. Completa fechas, horarios y costo desde el objeto FILO (js/datos.js)
   2. Cómo se arma el objeto que se guarda

   La validación y el envío los hace js/formulario.js
========================================= */
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-filo");
    if (!form) return;

    // "2027-04-29" → "Jueves 29 de Abril" (como en la info original)
    const fechaLarga = (iso) => {
        const fecha = new Date(iso + "T12:00:00");
        const dia = fecha.toLocaleDateString("es-AR", { weekday: "long" });
        const mes = fecha.toLocaleDateString("es-AR", { month: "long" });
        const mayus = (t) => t.charAt(0).toUpperCase() + t.slice(1);
        return `${mayus(dia)} ${fecha.getDate()} de ${mayus(mes)}`;
    };

    const ponerHTML = (id, html) => { document.getElementById(id).innerHTML = html; };
    const salida = FILO.desde ? fechaLarga(FILO.desde) : null;
    const regreso = FILO.hasta ? fechaLarga(FILO.hasta) : null;

    /* ---------- 1. INFO ---------- */

    document.getElementById("filo-titulo").textContent = FILO.nombre;
    document.title = `${FILO.nombre} | LAGRAM`;

    ponerHTML("filo-cuando", salida && regreso
        ? `del <strong>${salida} al ${regreso}.</strong>`
        : `en <strong>fechas a confirmar.</strong>`);

    ponerHTML("filo-hora-micro", FILO.horaSalidaECEA
        ? `a las ${escaparHTML(FILO.horaSalidaECEA)}.`
        : `(horario a confirmar).`);

    ponerHTML("filo-costo", formatearPrecio(FILO.costo));
    ponerHTML("filo-dias-pago", String(FILO.diasParaPagar));

    const encuentroECEA = salida && FILO.horaSalidaECEA
        ? `el <strong>${salida} a las ${escaparHTML(FILO.horaSalidaECEA)}.</strong>`
        : `el día de salida <strong>(día y horario a confirmar).</strong>`;
    const llegadaParque = FILO.horaLlegadaParque
        ? `a las ${escaparHTML(FILO.horaLlegadaParque)}`
        : `(horario a confirmar)`;
    const vuelta = regreso && FILO.horaRegreso
        ? `el <strong>${regreso} a las ${escaparHTML(FILO.horaRegreso)}.</strong>`
        : `el último día <strong>(horario a confirmar).</strong>`;

    ponerHTML("filo-horarios",
        `Si vas en micro o en auto (y podés llevar gente), te esperamos en ECEA ${encuentroECEA} ` +
        `Si vas directo al parque, te esperamos ahí ${llegadaParque} para cenar todos juntos. ` +
        `Para el regreso, salimos del parque ${vuelta}`);

    // El texto de ayuda de "Voy al FILO en..." repite los horarios, sin negritas
    document.getElementById("ayuda-traslado").textContent =
        document.getElementById("filo-horarios").textContent.split("Para el regreso")[0].trim();

    document.querySelectorAll(".filo-contacto").forEach(a => {
        a.href = `https://wa.me/${soloNumeros(FILO.contacto)}`;
        a.textContent = FILO.contacto;
    });

    if (FILO.estado === "cerrada") {
        document.getElementById("aviso-estado").hidden = false;
        form.hidden = true;
        return;
    }

    /* ---------- 2. ACTIVAR EL FORMULARIO ---------- */

    iniciarFormulario(form, {
        armar: (d) => {
            const texto = (nombre) => (d.get(nombre) || "").trim() || null;
            return {
                formulario: "filo",
                temporada: FILO.nombre,
                nombre: texto("nombre"),
                apellido: texto("apellido"),
                celular: soloNumeros(d.get("celular")),
                email: texto("email")?.toLowerCase() ?? null,
                participacion: d.getAll("participacion"),
                iglesia: texto("iglesia"),
                traslado: d.get("traslado"),
                dieta: d.get("dieta"),
                comentarios: texto("comentarios")
            };
        }
    });
});
