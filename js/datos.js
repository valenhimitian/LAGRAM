/* =========================================
   DATOS DE EVENTOS (fuente única)
   -----------------------------------------
   Todo el sitio (Inicio y Proyectos) lee los eventos de este array.
   Para agregar, sacar o editar un evento, se toca SOLO este archivo.

   Más adelante esto se reemplaza por una tabla "eventos" en Supabase
   con las mismas columnas, así que el resto del código no cambia.

   Campos:
   - slug:        identificador corto, se usa en URLs y en los id del HTML
   - tipo:        "campamento" (zona principal en zigzag) o "iniciativa" (grilla)
   - destacado:   true = aparece en las tarjetas del Inicio
   - inscripcion: true = tiene formulario online. El botón "Inscribirme" aparece
                  solo mientras las inscripciones estén abiertas (ver fechas más abajo)
   - formulario:  (opcional) página de inscripción propia; si no está, usa inscripcion.html
   - imagen:      ruta de la foto, o null si todavía no hay foto
   - imagenFondo: (opcional) otra foto para el encabezado de su página; si no está, usa "imagen"
   - posicionFondo: (opcional) encuadre vertical de esa foto, ej: "30%" (0% = arriba)
   - edades:      (opcional) franja de edad que se muestra como etiqueta
========================================= */
const EVENTOS = [
    // ---------- CAMPAMENTOS ----------
    {
        slug: "10-12",
        tipo: "campamento",
        titulo: "Campamento 10 a 12",
        imagen: "assets/img/10-12.jpg",
        descripcion: "Este campamento sienta las bases de un crecimiento integral en una relación con Jesús, a partir de descubrir y profundizar su conocimiento de la imagen de Dios.",
        destacado: true,
        inscripcion: true
    },
    {
        slug: "13-15",
        tipo: "campamento",
        titulo: "Campamento 13 a 15",
        imagen: "assets/img/13-15.jpg",
        descripcion: "Este campamento levanta las columnas que sostienen una vida con Jesús, desarrollando convicción sobre principios centrales de la Biblia.",
        destacado: true,
        inscripcion: true
    },
    {
        slug: "16-18",
        tipo: "campamento",
        titulo: "Campamento 16 a 18",
        imagen: "assets/img/16-18.jpg",
        descripcion: "Este campamento desafía a los adolescentes a buscar su propia manera de experimentar la fe.",
        destacado: true,
        inscripcion: true
    },
    {
        slug: "22-26",
        tipo: "campamento",
        titulo: "Campamento 22 a 26",
        imagen: "assets/img/22-26.jpg",
        descripcion: "Este campamento invita a hacer una pausa en la carrera de la vida para revisar el camino y ganar impulso para seguir avanzando.",
        destacado: false,
        inscripcion: true,
        formulario: "inscripcion-22-26.html"
    },
    {
        slug: "filo",
        tipo: "campamento",
        titulo: "Retiro FILO",
        imagen: "assets/img/FILO.jpg",
        descripcion: "El retiro del equipo de trabajo de LAGRAM: tiempo para afilarnos, capacitarnos y buscar a Dios juntos.",
        destacado: false,
        inscripcion: true,
        formulario: "inscripcion-filo.html"   // FILO tiene su propio formulario
    },

    // ---------- OTRAS INICIATIVAS ----------
    // vigente: true  = se sigue haciendo → aparece en "Más iniciativas"
    // vigente: false = ya no se hace     → aparece en "Propuestas que hicimos"
    // ultimaEdicion: texto que se muestra como referencia (ej: "2024")
    // La info completa de cada una está en js/detalles.js (página evento.html)
    {
        slug: "expocarreras",
        tipo: "iniciativa",
        titulo: "ExpoCarreras",
        imagen: "assets/img/expocarreras.jpg",
        imagenFondo: "assets/img/expocarreras-fondo.jpg",
        posicionFondo: "40%",
        edades: "16 a 26 años",
        descripcion: "Orientación vocacional y charlas con profesionales para ayudarte a elegir tu futuro.",
        vigente: true,
        ultimaEdicion: "2026",
        destacado: false,
        inscripcion: false
    },
    {
        slug: "picnic",
        tipo: "iniciativa",
        titulo: "Picnic",
        imagen: "assets/img/picnic.jpg",
        imagenFondo: "assets/img/picnic-fondo.jpg",
        posicionFondo: "45%",
        edades: "10 a 15 años",
        descripcion: "Un día al aire libre, una escapada con amigos, rica comida, matecitos, charlitas, deportes y juegos. En fin, un planazo. Una hermosa propuesta para cerrar el verano con todo.",
        vigente: true,
        ultimaEdicion: "2026",
        destacado: false,
        inscripcion: false
    },
    {
        slug: "feriadito",
        tipo: "iniciativa",
        titulo: "Feriadito",
        imagen: "assets/img/feriadito.jpg",
        imagenFondo: "assets/img/feriadito-fondo.jpg",
        posicionFondo: "30%",
        edades: "19 a 26 años",
        descripcion: "Es una propuesta nueva, que te invita a desconectar de la rutina para pasar un día rodeado de gente del bien, comiendo rico, en modo chill, con cafecito y/o matecito de por medio y charlando de la vida, como lo harías en cualquier FERIADITO.",
        vigente: true,
        ultimaEdicion: "2026",
        destacado: false,
        inscripcion: false
    },
    {
        slug: "arte",
        tipo: "iniciativa",
        titulo: "Arte",
        imagen: "assets/img/arte.jpg",
        imagenFondo: "assets/img/arte-fondo.jpg",
        posicionFondo: "45%",
        edades: "10 a 18 años",
        descripcion: "Un día entero para explorar juntos diferentes formas de hacer arte y experimentar nuevas maneras de conectar con Dios.",
        vigente: false,
        ultimaEdicion: "2024",
        destacado: false,
        inscripcion: false
    },
    {
        slug: "lagrampiada",
        tipo: "iniciativa",
        titulo: "LAGRAMPIADA",
        imagen: "assets/img/lagrampiada.jpg",
        imagenFondo: "assets/img/lagrampiada-fondo.jpg",
        posicionFondo: "35%",
        descripcion: "Una noche llena de juegos, deportes, comida rica y amigos.",
        vigente: false,
        ultimaEdicion: null,
        destacado: false,
        inscripcion: false
    },
    {
        slug: "gamers",
        tipo: "iniciativa",
        titulo: "Gamers",
        imagen: "assets/img/gamers.jpg",
        imagenFondo: "assets/img/gamers-fondo.jpg",
        posicionFondo: "20%",
        edades: "11 a 19 años",
        descripcion: "Un día pensado para que chicos y chicas de entre 11 a 19 años, fanáticos de los videojuegos, se encuentren a jugar en un ambiente distinto.",
        vigente: false,
        ultimaEdicion: null,
        destacado: false,
        inscripcion: false
    }
];

/* =========================================
   FECHAS DE INSCRIPCIÓN
   -----------------------------------------
   Las inscripciones se abren y cierran SOLAS según estas fechas.
   Nadie tiene que acordarse de "prender" o "apagar" nada.

   inscripcion: {
       desde: "AAAA-MM-DD",          primer día para anotarse
       hasta: "AAAA-MM-DD",          último día para anotarse
       listaEsperaHasta: "AAAA-MM-DD" (opcional) después de "hasta" se puede
                                      seguir anotando, pero entra a lista de espera
   }

   Según la fecha de hoy, cada inscripción queda en uno de estos estados:
   - Sin fechas cargadas  → "proximamente" (no se muestra el formulario)
   - Antes de "desde"     → "proximamente" (avisa cuándo abre)
   - Entre desde y hasta  → "abierta"
   - Hasta listaEspera    → "lista-espera"
   - Después              → "cerrada"
========================================= */

/* ---------- CAMPAMENTOS DE 10 A 18 ---------- */
const TEMPORADA = {
    nombre: "Campamentos de Verano 2027",
    inscripcion: { desde: null, hasta: null, listaEsperaHasta: null },
    aviso: null,                  // desde cuándo se avisa quién quedó, ej: "2026-12-09"
    lugar: 'parque "El Sembrador" en la localidad de Máximo Paz, Buenos Aires',
    salida: "Los micros salen de Irigoyen y Tinogasta, Villa Real, CABA (Escuela ECEA)",
    diasParaPagar: 5,
    contacto: "+54 9 11 6376-5990",

    // Una entrada por campamento. edadMin/edadMax arman la lista de edades del formulario.
    // fechas: texto libre (ej: "22 al 25 de Enero"), costo: número (ej: 150000)
    campamentos: [
        { slug: "10-12", edadMin: 10, edadMax: 12, fechas: null, costo: null },
        { slug: "13-15", edadMin: 13, edadMax: 15, fechas: null, costo: null },
        { slug: "16-18", edadMin: 16, edadMax: 18, fechas: null, costo: null }
    ]
};

/* ---------- CAMPAMENTO 22 A 26 ---------- */
// Lo que está en null se muestra como "a confirmar".
const CAMPA_22_26 = {
    nombre: "Campamento 22 a 26",
    inscripcion: { desde: null, hasta: null, listaEsperaHasta: null },
    aviso: null,                  // desde cuándo se avisa quién quedó, ej: "2027-07-09"
    lugar: 'parque "El Sembrador" en la localidad de Máximo Paz, Buenos Aires',
    salida: "Los micros salen de Irigoyen y Tinogasta, Villa Real, CABA (Escuela ECEA)",
    fechas: null,                 // texto libre, ej: "14 al 17 de Agosto"
    costo: null,                  // ej: 180000
    diasParaPagar: 5,
    contacto: "+54 9 11 6376-5990"
};

/* ---------- FILO (retiro del Equipo de Trabajo) ---------- */
// Lo que está en null se muestra como "a confirmar". Horas como texto ("19hs").
const FILO = {
    nombre: "FILO 2027",
    inscripcion: { desde: null, hasta: null, listaEsperaHasta: null },
    desde: null,                  // día de salida del retiro, ej: "2027-04-29"
    hasta: null,                  // día de regreso
    horaSalidaECEA: null,         // ej: "19hs"
    horaLlegadaParque: null,      // ej: "21hs"
    horaRegreso: null,            // ej: "17hs"
    costo: null,                  // ej: 120000
    diasParaPagar: 5,
    contacto: "+54 9 11 6376-5990"
};
