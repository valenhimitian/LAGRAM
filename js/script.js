/* =========================================
   UTILIDADES
========================================= */

// Escapa texto antes de meterlo en innerHTML.
// Hoy los datos son nuestros, pero cuando vengan de la base de datos
// esto evita que un texto con "<script>" se ejecute (ataque XSS).
function escaparHTML(texto) {
    return String(texto)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

// Devuelve la foto del evento, o un bloque con el logo si todavía no hay foto.
function imagenEvento(evento, clase) {
    if (evento.imagen) {
        return `<img src="${escaparHTML(evento.imagen)}" alt="${escaparHTML(evento.titulo)}" class="${clase}" loading="lazy">`;
    }
    return `<div class="${clase} imagen-pendiente" role="img" aria-label="${escaparHTML(evento.titulo)}">
                <img src="assets/img/iso.png" alt="">
            </div>`;
}

function linkInscripcion(evento) {
    if (evento.formulario) return evento.formulario;
    return `inscripcion.html?evento=${encodeURIComponent(evento.slug)}`;
}

/* =========================================
   ESTADO DE LAS INSCRIPCIONES
   -----------------------------------------
   Una sola función decide si una inscripción está abierta, según las
   fechas de js/datos.js. La usan los botones de Proyectos, el pop-up y
   los formularios, así nunca se contradicen entre sí.
========================================= */

// "2026-12-01" → "1 de diciembre"
function formatearDia(iso) {
    return new Date(iso + "T12:00:00").toLocaleDateString("es-AR", { day: "numeric", month: "long" });
}

// Lee ?algo de la URL (ej: "demo" o "hoy")
const parametroURL = (nombre) => new URLSearchParams(location.search).get(nombre);

// Fecha de hoy en formato "AAAA-MM-DD".
// Para PROBAR otros días sin tocar datos.js: agregá ?hoy=2026-12-05 a la URL.
function hoyISO() {
    const simulado = parametroURL("hoy");
    if (/^\d{4}-\d{2}-\d{2}$/.test(simulado || "")) return simulado;
    return new Date().toLocaleDateString("en-CA");
}

/**
 * Devuelve "proximamente" | "abierta" | "lista-espera" | "cerrada"
 * @param {{desde, hasta, listaEsperaHasta}} ventana  fechas de inscripción
 */
function estadoInscripcion(ventana) {
    const hoy = hoyISO();
    if (!ventana || !ventana.desde || !ventana.hasta) return "proximamente";
    if (hoy < ventana.desde) return "proximamente";
    if (hoy <= ventana.hasta) return "abierta";
    if (ventana.listaEsperaHasta && hoy <= ventana.listaEsperaHasta) return "lista-espera";
    return "cerrada";
}

const seAceptanInscripciones = (estado) => estado === "abierta" || estado === "lista-espera";

// Qué fechas de inscripción le corresponden a cada evento con formulario
function ventanaDeEvento(evento) {
    if (evento.slug === "filo") return FILO.inscripcion;
    if (evento.slug === "22-26") return CAMPA_22_26.inscripcion;
    if (TEMPORADA.campamentos.some(c => c.slug === evento.slug)) return TEMPORADA.inscripcion;
    return null;
}

/* ---------- MODO VISTA PREVIA ----------
   Para mostrar los formularios aunque las inscripciones estén cerradas
   (por ejemplo, en una reunión con LAGRAM).
   - Entrar a cualquier página con ?demo   → se activa para toda la visita
   - Entrar con ?demo=no                   → se desactiva
   Lo guardamos en sessionStorage: se borra solo al cerrar la pestaña. */
function modoDemo() {
    const param = parametroURL("demo");
    try {
        if (param === "no") sessionStorage.removeItem("lagram_demo");
        else if (param !== null) sessionStorage.setItem("lagram_demo", "si");
        return sessionStorage.getItem("lagram_demo") === "si";
    } catch {
        return param !== null && param !== "no";   // si el navegador bloquea el storage
    }
}

// En modo demo, cualquier inscripción cerrada se muestra como abierta
function estadoVisible(ventana) {
    const real = estadoInscripcion(ventana);
    return modoDemo() && !seAceptanInscripciones(real) ? "abierta" : real;
}

document.addEventListener("DOMContentLoaded", () => {
    if (!modoDemo()) return;
    const cartel = document.createElement("div");
    cartel.className = "cartel-demo";
    cartel.innerHTML = `Vista previa: los formularios se muestran aunque las inscripciones estén cerradas.
                        <a href="${location.pathname}?demo=no">Salir</a>`;
    document.body.appendChild(cartel);
});

/* =========================================
   INICIO: Tarjetas de proyectos destacados
========================================= */
document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid-proyectos");
    if (!grid) return;

    grid.innerHTML = EVENTOS
        .filter(evento => evento.destacado)
        .map(evento => `
            <article class="card">
                ${imagenEvento(evento, "card__imagen")}
                <div class="card__contenido">
                    <h3 class="card__titulo">${escaparHTML(evento.titulo)}</h3>
                    <p class="card__descripcion">${escaparHTML(evento.descripcion)}</p>
                    <a href="proyectos.html#${escaparHTML(evento.slug)}" class="card__boton">Conocer más</a>
                </div>
            </article>
        `)
        .join("");
});

/* =========================================
   PROYECTOS: Campamentos en zigzag
========================================= */

// Abierta → "Inscribirme". Cerrada → "Más info" + aviso, que lleva a la
// página del formulario, donde está toda la info y el detalle de cuándo abre.
function botonInscripcion(evento) {
    if (!evento.inscripcion) return "";
    const estado = estadoVisible(ventanaDeEvento(evento));
    if (seAceptanInscripciones(estado)) {
        return `<a href="${linkInscripcion(evento)}" class="btn btn--primario">Inscribirme</a>`;
    }
    const aviso = estado === "cerrada" ? "Inscripciones cerradas" : "Inscripciones próximamente";
    return `<div class="proyecto-row__acciones">
                <a href="${linkInscripcion(evento)}" class="btn btn--secundario">Más info</a>
                <span class="proyecto-row__estado">${aviso}</span>
            </div>`;
}

document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("lista-campamentos");
    if (!contenedor) return;

    contenedor.innerHTML = EVENTOS
        .filter(evento => evento.tipo === "campamento")
        .map((evento, i) => `
            <article class="proyecto-row ${i % 2 === 1 ? "proyecto-row--invertido" : ""}" id="${escaparHTML(evento.slug)}">
                <div class="proyecto-row__imagen">
                    ${imagenEvento(evento, "proyecto-row__foto")}
                </div>
                <div class="proyecto-row__texto">
                    <h2>${escaparHTML(evento.titulo)}</h2>
                    <p>${escaparHTML(evento.descripcion)}</p>
                    ${botonInscripcion(evento)}
                </div>
            </article>
        `)
        .join("");

    // El contenido se dibuja después de cargar el HTML, así que el salto al
    // #ancla del link ("Conocer más") no queda bien solo. Lo corregimos cuando
    // la página terminó de cargar, dejando lugar para el header fijo.
    if (location.hash) {
        window.addEventListener("load", () => {
            const destino = document.getElementById(location.hash.slice(1));
            if (!destino) return;
            const y = destino.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo(0, y);
        });
    }
});

/* =========================================
   PROYECTOS: Grilla de otras iniciativas
========================================= */
// Tarjeta de una iniciativa: lleva a su página (evento.html?e=slug)
function tarjetaIniciativa(evento) {
    const epoca = !evento.vigente
        ? `<span class="tarjeta-iniciativa__epoca">${evento.ultimaEdicion ? "Hasta " + escaparHTML(evento.ultimaEdicion) : "Edición pasada"}</span>`
        : "";
    return `
        <a class="tarjeta-iniciativa ${evento.vigente ? "" : "tarjeta-iniciativa--pasada"}" id="${escaparHTML(evento.slug)}"
           href="evento.html?e=${encodeURIComponent(evento.slug)}">
            <div class="tarjeta-iniciativa__foto">
                ${imagenEvento(evento, "tarjeta-iniciativa__imagen")}
                ${epoca}
            </div>
            <div class="tarjeta-iniciativa__cuerpo">
                ${evento.edades ? `<span class="tarjeta-iniciativa__edades">${escaparHTML(evento.edades)}</span>` : ""}
                <h3 class="tarjeta-iniciativa__titulo">${escaparHTML(evento.titulo)}</h3>
                ${evento.descripcion ? `<p class="tarjeta-iniciativa__texto">${escaparHTML(evento.descripcion)}</p>` : ""}
                <span class="tarjeta-iniciativa__mas">${evento.vigente ? "Conocer más" : "Ver cómo era"} →</span>
            </div>
        </a>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    const vigentes = document.getElementById("grid-otros-proyectos");
    const pasadas = document.getElementById("grid-historicos");
    const iniciativas = EVENTOS.filter(evento => evento.tipo === "iniciativa");

    if (vigentes) {
        vigentes.innerHTML = iniciativas.filter(e => e.vigente).map(tarjetaIniciativa).join("");
    }
    if (pasadas) {
        pasadas.innerHTML = iniciativas.filter(e => !e.vigente).map(tarjetaIniciativa).join("");
    }
});

/* =========================================
   HEADER: Marcar la página actual en el menú
   -----------------------------------------
   Antes había un ScrollSpy que buscaba links tipo "#seccion",
   pero el menú apunta a páginas (index.html, proyectos.html...),
   así que casi nunca marcaba nada. Ahora se marca según la página.
========================================= */
document.addEventListener("DOMContentLoaded", () => {
    // Netlify muestra las URLs sin ".html" (/proyectos en vez de /proyectos.html),
    // así que comparamos los nombres sin la extensión. "" o "index" = Inicio.
    const normalizar = (ruta) => ruta.split("/").pop().replace(/\.html$/, "") || "index";
    // Las páginas de inscripción y de cada propuesta son parte de "Proyectos"
    const seccionDe = {
        "evento": "proyectos",
        "inscripcion": "proyectos",
        "inscripcion-22-26": "proyectos",
        "inscripcion-filo": "proyectos"
    };
    const pagina = normalizar(location.pathname);
    const paginaActual = seccionDe[pagina] || pagina;

    document.querySelectorAll(".header__link").forEach(enlace => {
        if (normalizar(enlace.getAttribute("href")) === paginaActual) {
            enlace.classList.add("activo");
            enlace.setAttribute("aria-current", "page");
        }
    });
});

/* =========================================
   LÓGICA DEL CARRUSEL DEL EQUIPO
========================================= */
document.addEventListener("DOMContentLoaded", () => {
    const riel = document.getElementById("carrusel-riel");
    const btnPrev = document.getElementById("btn-prev");
    const btnNext = document.getElementById("btn-next");

    if (riel && btnPrev && btnNext) {
        // Al hacer clic en 'Siguiente', deslizamos el riel 300px a la derecha
        btnNext.addEventListener("click", () => {
            riel.scrollBy({ left: 300, behavior: 'smooth' });
        });

        // Al hacer clic en 'Anterior', deslizamos el riel 300px a la izquierda
        btnPrev.addEventListener("click", () => {
            riel.scrollBy({ left: -300, behavior: 'smooth' });
        });
    }
});

/* =========================================
   LÓGICA DEL MENÚ HAMBURGUESA
========================================= */
const btnHamburguesa = document.getElementById('menu-btn');
const menuNav = document.getElementById('menu-nav');

if (btnHamburguesa && menuNav) {
    btnHamburguesa.addEventListener('click', () => {
        // Alternar las clases para abrir/cerrar el menú
        const abierto = menuNav.classList.toggle('header__nav--activo');
        btnHamburguesa.classList.toggle('header__hamburguesa--activo');
        btnHamburguesa.setAttribute('aria-expanded', abierto);
    });

    // Cerrar el menú automáticamente al hacer clic en un enlace (útil en mobile)
    document.querySelectorAll('.header__link').forEach(link => {
        link.addEventListener('click', () => {
            menuNav.classList.remove('header__nav--activo');
            btnHamburguesa.classList.remove('header__hamburguesa--activo');
            btnHamburguesa.setAttribute('aria-expanded', false);
        });
    });
}

/* =========================================
   LÓGICA DEL POP-UP (Gestor Automático de Campañas)
========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('popup-novedades');
    if (!popup) return;

    // 1. LAS CAMPAÑAS
    // No tienen fechas propias: se muestran según el estado de las inscripciones
    // (js/datos.js). Se muestra la primera de la lista que esté activa.
    // estadoVisible: en modo demo (?demo) se muestran como abiertas
    const campamentos = estadoVisible(TEMPORADA.inscripcion);
    const filo = estadoVisible(FILO.inscripcion);
    const c2226 = estadoVisible(CAMPA_22_26.inscripcion);
    const abreCampamentos = TEMPORADA.inscripcion.desde;

    const campañasLAGRAM = [
        {
            id: 'inscripciones-campamentos', // Si cambiás este ID, el cartel le vuelve a aparecer a quienes ya lo cerraron
            activa: seAceptanInscripciones(campamentos),
            imagen: 'assets/img/13-15.jpg',
            titulo: campamentos === 'lista-espera' ? '¡Todavía podés anotarte!' : '¡Inscripciones Abiertas!',
            texto: campamentos === 'lista-espera'
                ? 'Las inscripciones cerraron, pero podés sumarte a la lista de espera de los campamentos de 10-12, 13-15 y 16-18.'
                : 'Asegurá tu lugar para los campamentos de 10-12, 13-15 y 16-18. ¡No te quedes afuera!',
            botonTexto: 'Anotarme ahora',
            botonLink: 'inscripcion.html'
        },
        {
            id: 'inscripciones-22-26',
            activa: seAceptanInscripciones(c2226),
            imagen: 'assets/img/22-26.jpg',
            titulo: '¡Inscripciones abiertas para el 22 a 26!',
            texto: 'Una pausa en la carrera de la vida para revisar el camino y ganar impulso para seguir avanzando.',
            botonTexto: 'Anotarme',
            botonLink: 'inscripcion-22-26.html'
        },
        {
            id: 'inscripciones-filo',
            activa: seAceptanInscripciones(filo),
            imagen: 'assets/img/FILO.jpg',
            titulo: '¡Se viene FILO!',
            texto: 'El retiro del Equipo de Trabajo. Tiempo de recargar energías, capacitarnos y buscar a Dios juntos.',
            botonTexto: 'Pre-inscribirme',
            botonLink: 'inscripcion-filo.html'
        },
        {
            id: 'previa-campamentos',
            activa: campamentos === 'proximamente',
            imagen: 'assets/img/16-18.jpg',
            titulo: '¡Se vienen los campas de verano!',
            texto: abreCampamentos
                ? `Las inscripciones para los campamentos de 10 a 12, 13 a 15 y 16 a 18 abren el ${formatearDia(abreCampamentos)}. ¡Estate atento!`
                : 'Muy pronto abrimos las inscripciones para los campamentos de 10 a 12, 13 a 15 y 16 a 18. ¡Estate atento!',
            botonTexto: 'Conocé los campamentos',
            botonLink: 'proyectos.html'
        }
    ];

    // 2. ELEGIR LA CAMPAÑA Y REGLA ANTI-SPAM
    const campañaActiva = campañasLAGRAM.find(c => c.activa);
    if (!campañaActiva) return;

    const claveVisto = `popup_${campañaActiva.id}`;
    let yaLoVio = false;
    try { yaLoVio = !!sessionStorage.getItem(claveVisto); } catch { /* sin storage: se muestra */ }
    if (yaLoVio) return;

    document.getElementById('popup-img').src = campañaActiva.imagen;
    document.getElementById('popup-titulo').textContent = campañaActiva.titulo;
    document.getElementById('popup-texto').textContent = campañaActiva.texto;

    const btn = document.getElementById('popup-btn');
    btn.textContent = campañaActiva.botonTexto;
    btn.href = campañaActiva.botonLink;

    // Mostrar con delay
    setTimeout(() => popup.classList.add('popup-overlay--activo'), 2500);

    // Cerrar (con la X, tocando afuera o con Escape) y recordar que ya se vio
    const cerrar = () => {
        popup.classList.remove('popup-overlay--activo');
        try { sessionStorage.setItem(claveVisto, 'true'); } catch { /* sin storage */ }
    };
    document.getElementById('btn-cerrar-popup').addEventListener('click', cerrar);
    btn.addEventListener('click', cerrar);
    popup.addEventListener('click', (e) => { if (e.target === popup) cerrar(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrar(); });
});
