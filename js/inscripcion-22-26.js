/* =========================================
   INSCRIPCIÓN AL CAMPAMENTO 22 A 26
   -----------------------------------------
   Lo particular de este formulario:
   1. Info del campamento desde el objeto CAMPA_22_26 (js/datos.js)
   2. Cómo se arma el objeto que se guarda

   Los pasos, la validación y el envío los hace js/formulario.js
========================================= */
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-22-26");
    if (!form) return;

    const c = CAMPA_22_26;
    const { desde, hasta } = c.inscripcion;

    /* ---------- 1. INFO ---------- */

    document.getElementById("c2226-titulo").textContent = c.nombre;
    document.title = `${c.nombre} | LAGRAM`;

    document.getElementById("c2226-info").innerHTML = `
        <h2 class="inscripcion-info__titulo">Todo lo que tenés que saber</h2>
        <dl class="inscripcion-info__lista">
            <div>
                <dt>¿Dónde?</dt>
                <dd>${c.lugar ? escaparHTML(c.lugar) + "." : "Lugar a confirmar."}
                    ${c.salida ? "<br>" + escaparHTML(c.salida) + "." : ""}</dd>
            </div>
            <div>
                <dt>¿Cuándo y cuánto cuesta?</dt>
                <dd>
                    <ul class="inscripcion-info__campas">
                        <li><strong>22 a 26 años</strong>
                            <span>${c.fechas ? escaparHTML(c.fechas) : "Fechas a confirmar"}</span>
                            <span>${formatearPrecio(c.costo)}</span></li>
                    </ul>
                </dd>
            </div>
            <div>
                <dt>¿Cómo me anoto?</dt>
                <dd>${desde && hasta
                        ? `Te anotás del <strong>${formatearFecha(desde)}</strong> al <strong>${formatearFecha(hasta)}</strong> completando el formulario de esta página.`
                        : `Te anotás desde esta página en las fechas de inscripción, que vamos a anunciar en nuestras redes.`}
                    Después te escribimos por WhatsApp para confirmarte la vacante y pasarte los datos para el pago.
                    Desde ese mensaje tenés <strong>${c.diasParaPagar} días</strong> para pagar y asegurar tu lugar.</dd>
            </div>
            <div>
                <dt>¿Más preguntas?</dt>
                <dd>Escribinos al <a href="https://wa.me/${soloNumeros(c.contacto)}" target="_blank" rel="noopener">${escaparHTML(c.contacto)}</a></dd>
            </div>
        </dl>
    `;

    /* ---------- ESTADO DE LAS INSCRIPCIONES ---------- */

    const estado = estadoVisible(c.inscripcion);
    if (!mostrarAvisoDeEstado(form, estado, c.inscripcion)) return;

    /* ---------- 2. ACTIVAR EL FORMULARIO ---------- */

    iniciarFormulario(form, {
        reglas: {
            fecha_nacimiento: (v) => {
                const edad = (Date.now() - new Date(v + "T12:00:00")) / (365.25 * 24 * 60 * 60 * 1000);
                return (edad >= 15 && edad <= 45) || "Revisá la fecha de nacimiento.";
            }
        },
        armar: (d, visible) => {
            const texto = (nombre) => (d.get(nombre) || "").trim() || null;
            const edad = d.get("edad");
            return {
                formulario: "22-26",
                temporada: c.nombre,
                campamento: "22-26",
                edad: /^\d+$/.test(edad) ? Number(edad) : null,
                edad_fuera_de_rango: edad === "menor" || edad === "mayor" ? edad : null,
                nombre: texto("nombre"),
                apellido: texto("apellido"),
                sexo: d.get("sexo"),
                fecha_nacimiento: d.get("fecha_nacimiento"),
                dni: soloNumeros(d.get("dni")),
                va_iglesia: d.get("va_iglesia") === "si",
                iglesia: visible("iglesia") ? texto("iglesia") : null,
                dieta: d.get("dieta"),
                dieta_detalle: visible("dieta_detalle") ? texto("dieta_detalle") : null,
                experiencia: d.get("experiencia"),
                direccion: texto("direccion"),
                barrio: texto("barrio"),
                municipio: texto("municipio"),
                codigo_postal: texto("codigo_postal")?.toUpperCase() ?? null,
                celular: soloNumeros(d.get("celular")),
                instagram: texto("instagram")?.replace(/^@/, "") ?? null,
                email: texto("email")?.toLowerCase() ?? null,
                comentarios: texto("comentarios"),
                lista_espera: estado === "lista-espera"
            };
        }
    });
});
