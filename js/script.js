/* =========================================
   SIMULACIÓN DE BASE DE DATOS (Backend)
========================================= */
const baseDeDatosProyectos = [
    {
        id: 1,
        titulo: "Campamento 10 a 12",
        imagen: "assets/img/10-12.jpg", 
        descripcion: "Este campamento sienta las bases de un crecimiento integral en una relación con Jesús, a partir de descubrir y profundizar su conocimiento de la imagen de Dios.",
        link: "proyectos.html#camp-10-12" 
    },
    {
        id: 2,
        titulo: "Campamento 13 a 15",
        imagen: "assets/img/13-15.jpg",  
        descripcion: "Este campamento levanta las columnas que sostienen una vida con Jesús, desarrollando convicción sobre principios centrales de la Biblia.",
        link: "proyectos.html#camp-13-15" 
    },
    {
        id: 3,
        titulo: "Campamento 16 a 18",
        imagen: "assets/img/16-18.jpg",
        descripcion: "Este campamento desafía a los adolescentes a buscar su propia manera de experimentar la fe.",
        link: "proyectos.html#camp-16-18" 
    }
];

/* =========================================
   SIMULACIÓN: OTRAS INICIATIVAS (Backend)
========================================= */
const baseDeDatosOtrasIniciativas = [
    {
        id: 4,
        titulo: "Campamento 22 a 26",
        imagen: "assets/img/22-26.jpg",
        descripcion: "Retiro para equipar a los futuros líderes con herramientas prácticas, empatía y visión integral.",
        link: "#" // Queda preparado para un futuro enlace
    },
    {
        id: 5,
        titulo: "FILO",
        imagen: "assets/img/FILO.jpg",
        descripcion: "Retiro para el equipo de trabajo, AFILATE.",
        link: "#"
    },
    {
        id: 6,
        titulo: "EXPO CARRERAS.",
        imagen: "assets/img/EXPO-CARRERAS.jpg",
        descripcion: "Iniciativas solidarias donde ponemos la fe en acción, impactando positivamente a nuestro entorno.",
        link: "#"
    },
    {
        id: 7,
        titulo: "LAGRAMPIADA",
        imagen: "assets/arte.jpg",
        descripcion: "Espacios de expresión creativa donde los adolescentes descubren y potencian sus talentos.",
        link: "#"
    },
    {
        id: 8,
        titulo: "ARTE",
        imagen: "assets/deportes.jpg",
        descripcion: "Fomentamos el compañerismo, el trabajo en equipo y la vida sana a través del deporte.",
        link: "#"
    }
];

/* =========================================
   LÓGICA DE RENDERIZADO (Frontend)
========================================= */
document.addEventListener("DOMContentLoaded", () => {
    // 1. Buscamos el contenedor vacío en el HTML
    const gridProyectos = document.getElementById("grid-proyectos");

    // 2. Verificamos que exista para no generar errores en otras páginas
    if (gridProyectos) {
        
        // 3. Recorremos nuestra "base de datos"
        baseDeDatosProyectos.forEach(proyecto => {
            
            // 4. Construimos la tarjeta inyectando los datos (Interpolación)
            const tarjetaHTML = `
                <article class="card">
                    <img src="${proyecto.imagen}" alt="${proyecto.titulo}" class="card__imagen">
                    <div class="card__contenido">
                        <h3 class="card__titulo">${proyecto.titulo}</h3>
                        <p class="card__descripcion">${proyecto.descripcion}</p>
                        <a href="${proyecto.link}" class="card__boton">Conocer más</a>
                    </div>
                </article>
            `;

            // 5. Agregamos la tarjeta al contenedor
            gridProyectos.innerHTML += tarjetaHTML;
        });
    }
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
   SCROLLSPY (Resaltado dinámico del menú)
========================================= */
document.addEventListener("DOMContentLoaded", () => {
    // Seleccionamos todas las secciones que queremos rastrear y todos los enlaces del menú
    const secciones = document.querySelectorAll("section");
    const enlacesMenu = document.querySelectorAll(".header__link");

    // Configuramos el observador
    const opcionesObserver = {
        root: null,
        rootMargin: "-50% 0px -50% 0px", // Detecta cuando la sección llega a la mitad de la pantalla
        threshold: 0
    };

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                // Obtenemos el ID de la sección que está visible (ej: "proyectos")
                const idSeccion = entrada.target.getAttribute("id");

                // Removemos la clase 'activo' de todos los enlaces
                enlacesMenu.forEach(enlace => enlace.classList.remove("activo"));

                // Le agregamos la clase 'activo' solo al enlace que coincide con la sección actual
                const enlaceActivo = document.querySelector(`.header__link[href="#${idSeccion}"]`);
                if (enlaceActivo) {
                    enlaceActivo.classList.add("activo");
                }
            }
        });
    }, opcionesObserver);

    // Le decimos al observador que vigile cada una de las secciones
    secciones.forEach(seccion => {
        observador.observe(seccion);
    });
});
/* =========================================
   RENDERIZADO: OTRAS INICIATIVAS (Página Proyectos)
========================================= */
document.addEventListener("DOMContentLoaded", () => {
    // 1. Buscamos el contenedor específico de la página secundaria
    const gridOtrosProyectos = document.getElementById("grid-otros-proyectos");

    // 2. Si el contenedor existe (o sea, si estamos en proyectos.html), ejecutamos el código
    if (gridOtrosProyectos) {
        
        // 3. Recorremos la nueva base de datos
        baseDeDatosOtrasIniciativas.forEach(iniciativa => {
            
            // 4. Reutilizamos EXACTAMENTE las mismas clases CSS de las tarjetas de Inicio
            const tarjetaHTML = `
                <article class="card">
                    <img src="${iniciativa.imagen}" alt="${iniciativa.titulo}" class="card__imagen">
                    <div class="card__contenido">
                        <h3 class="card__titulo">${iniciativa.titulo}</h3>
                        <p class="card__descripcion">${iniciativa.descripcion}</p>
                        <a href="${iniciativa.link}" class="card__boton">Conocer más</a>
                    </div>
                </article>
            `;

            // 5. Inyectamos la tarjeta en el HTML
            gridOtrosProyectos.innerHTML += tarjetaHTML;
        });
    }
});

// --- LÓGICA DEL MENÚ HAMBURGUESA ---
const btnHamburguesa = document.getElementById('menu-btn');
const menuNav = document.getElementById('menu-nav');

if (btnHamburguesa && menuNav) {
    btnHamburguesa.addEventListener('click', () => {
        // Alternar las clases para abrir/cerrar el menú
        menuNav.classList.toggle('header__nav--activo');
        btnHamburguesa.classList.toggle('header__hamburguesa--activo');
    });

    // Cerrar el menú automáticamente al hacer clic en un enlace (útil en mobile)
    const linksMenu = document.querySelectorAll('.header__link');
    linksMenu.forEach(link => {
        link.addEventListener('click', () => {
            menuNav.classList.remove('header__nav--activo');
            btnHamburguesa.classList.remove('header__hamburguesa--activo');
        });
    });
}
// =========================================
// LÓGICA DEL POP-UP (Gestor Automático de Campañas)
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('popup-novedades');
    if (!popup) return;

    // 1. LA BASE DE DATOS DE EVENTOS
    // Podés agregar todos los eventos del año acá. El código muestra el primero que coincida con la fecha de hoy.
    const campañasLAGRAM = [
        {
            id: 'verano-27', // Si cambiás este ID, el cartel le vuelve a aparecer a quienes ya lo cerraron
            inicio: '2026-11-15', 
            fin: '2027-01-31',
            imagen: 'assets/img/popup-verano.png', // Podés cambiar la foto según el evento
            titulo: '¡Inscripciones Abiertas!',
            texto: 'Asegurá tu lugar para los campamentos de 10-12, 13-15 y 16-18. ¡No te quedes afuera!',
            botonTexto: 'Anotarme ahora',
            botonLink: 'inscripcion.html'
        },
        {
            id: 'filo-27',
            inicio: '2027-02-15',
            fin: '2027-04-10',
            imagen: 'assets/img/popup-filo.png',
            titulo: 'Retiro FILO',
            texto: 'El evento exclusivo para staff. Tiempo de recargar energías, capacitarnos y buscar a Dios juntos.',
            botonTexto: 'Más info',
            botonLink: 'equipo.html'
        },
        {
            id: 'expocarreras-26',
            inicio: '2026-09-01', // Configurado para que lo veas funcionando HOY
            fin: '2026-10-30',
            imagen: 'assets/img/popup-banner.png', // Tu imagen actual
            titulo: 'ExpoCarreras 2026',
            texto: 'Vení a descubrir tu vocación charlando con profesionales de nuestra comunidad.',
            botonTexto: 'Ver cronograma',
            botonLink: '#eventos'
        }
    ];

    // 2. MOTOR DE BÚSQUEDA Y REGLA ANTI-SPAM
    const hoy = new Date();
    const hoyStr = hoy.toLocaleDateString('en-CA'); // Formato YYYY-MM-DD

    const campañaActiva = campañasLAGRAM.find(c => hoyStr >= c.inicio && hoyStr <= c.fin);

    if (campañaActiva) {
        const popupVisto = sessionStorage.getItem(`popup_${campañaActiva.id}`);

        if (!popupVisto) {
            // Inyectamos los datos en tu HTML blanco original
            document.getElementById('popup-img').src = campañaActiva.imagen;
            document.getElementById('popup-titulo').textContent = campañaActiva.titulo;
            document.getElementById('popup-texto').textContent = campañaActiva.texto;
            
            const btn = document.getElementById('popup-btn');
            btn.textContent = campañaActiva.botonTexto;
            btn.href = campañaActiva.botonLink;

            // Mostrar con delay
            setTimeout(() => {
                popup.classList.add('popup-overlay--activo');
            }, 2500);

            // Cerrar y guardar en memoria
            document.getElementById('btn-cerrar-popup').addEventListener('click', () => {
                popup.classList.remove('popup-overlay--activo');
                sessionStorage.setItem(`popup_${campañaActiva.id}`, 'true');
            });
        }
    }
});