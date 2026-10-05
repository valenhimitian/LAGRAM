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
    return `inscripcion.html?evento=${encodeURIComponent(evento.slug)}`;
}

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
                    ${evento.inscripcion
                        ? `<a href="${linkInscripcion(evento)}" class="btn btn--primario">Inscribirme</a>`
                        : ""}
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
document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid-otros-proyectos");
    if (!grid) return;

    grid.innerHTML = EVENTOS
        .filter(evento => evento.tipo === "iniciativa")
        .map(evento => `
            <article class="tarjeta-iniciativa" id="${escaparHTML(evento.slug)}">
                ${imagenEvento(evento, "tarjeta-iniciativa__imagen")}
                <div class="tarjeta-iniciativa__cuerpo">
                    <h4 class="tarjeta-iniciativa__titulo">${escaparHTML(evento.titulo)}</h4>
                    <p class="tarjeta-iniciativa__texto">${escaparHTML(evento.descripcion)}</p>
                </div>
            </article>
        `)
        .join("");
});

/* =========================================
   HEADER: Marcar la página actual en el menú
   -----------------------------------------
   Antes había un ScrollSpy que buscaba links tipo "#seccion",
   pero el menú apunta a páginas (index.html, proyectos.html...),
   así que casi nunca marcaba nada. Ahora se marca según la página.
========================================= */
document.addEventListener("DOMContentLoaded", () => {
    const paginaActual = location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".header__link").forEach(enlace => {
        if (enlace.getAttribute("href") === paginaActual) {
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

    // 1. LA BASE DE DATOS DE CAMPAÑAS
    // El código muestra la primera que coincida con la fecha de hoy.
    // Si una campaña no tiene foto propia, usa popup-banner.png.
    const campañasLAGRAM = [
        {
            id: 'verano-27', // Si cambiás este ID, el cartel le vuelve a aparecer a quienes ya lo cerraron
            inicio: '2026-11-15',
            fin: '2027-01-31',
            imagen: 'assets/img/popup-banner.png', // TODO: reemplazar por una foto de verano
            titulo: '¡Inscripciones Abiertas!',
            texto: 'Asegurá tu lugar para los campamentos de 10-12, 13-15 y 16-18. ¡No te quedes afuera!',
            botonTexto: 'Anotarme ahora',
            botonLink: 'proyectos.html#10-12'
        },
        {
            id: 'filo-27',
            inicio: '2027-02-15',
            fin: '2027-04-10',
            imagen: 'assets/img/FILO.jpg',
            titulo: 'Retiro FILO',
            texto: 'El evento exclusivo para staff. Tiempo de recargar energías, capacitarnos y buscar a Dios juntos.',
            botonTexto: 'Más info',
            botonLink: 'proyectos.html#filo'
        },
        {
            id: 'expocarreras-26',
            inicio: '2026-08-01',
            fin: '2026-08-29', // El evento fue el sábado 29 de agosto
            imagen: 'assets/img/popup-banner.png',
            titulo: 'ExpoCarreras 2026',
            texto: 'Vení a descubrir tu vocación charlando con profesionales de nuestra comunidad.',
            botonTexto: 'Más info',
            botonLink: 'proyectos.html#expocarreras'
        }
    ];

    // 2. MOTOR DE BÚSQUEDA Y REGLA ANTI-SPAM
    const hoyStr = new Date().toLocaleDateString('en-CA'); // Formato YYYY-MM-DD
    const campañaActiva = campañasLAGRAM.find(c => hoyStr >= c.inicio && hoyStr <= c.fin);
    if (!campañaActiva) return;

    const claveVisto = `popup_${campañaActiva.id}`;
    if (sessionStorage.getItem(claveVisto)) return;

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
        sessionStorage.setItem(claveVisto, 'true');
    };
    document.getElementById('btn-cerrar-popup').addEventListener('click', cerrar);
    btn.addEventListener('click', cerrar);
    popup.addEventListener('click', (e) => { if (e.target === popup) cerrar(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrar(); });
});
