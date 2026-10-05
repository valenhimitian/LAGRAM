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
   - inscripcion: true = muestra el botón "Inscribirme"
   - imagen:      ruta de la foto, o null si todavía no hay foto
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
        descripcion: "Un campamento para equipar a los futuros líderes con herramientas prácticas, empatía y visión integral.",
        destacado: false,
        inscripcion: true
    },
    {
        slug: "filo",
        tipo: "campamento",
        titulo: "Retiro FILO",
        imagen: "assets/img/FILO.jpg",
        descripcion: "El retiro del equipo de trabajo de LAGRAM: tiempo para afilarnos, capacitarnos y buscar a Dios juntos.",
        destacado: false,
        inscripcion: false
    },

    // ---------- OTRAS INICIATIVAS ----------
    {
        slug: "expocarreras",
        tipo: "iniciativa",
        titulo: "ExpoCarreras",
        imagen: "assets/img/EXPO-CARRERAS.jpg",
        descripcion: "Orientación vocacional y charlas con profesionales para ayudarte a elegir tu futuro.",
        destacado: false,
        inscripcion: false
    },
    {
        slug: "lagrampiada",
        tipo: "iniciativa",
        titulo: "LAGRAMPIADA",
        imagen: null,
        descripcion: "Fomentamos el compañerismo, el trabajo en equipo y la vida sana a través del deporte.",
        destacado: false,
        inscripcion: false
    },
    {
        slug: "arte",
        tipo: "iniciativa",
        titulo: "Arte",
        imagen: null,
        descripcion: "Espacios de expresión creativa donde los adolescentes descubren y potencian sus talentos.",
        destacado: false,
        inscripcion: false
    },
    {
        slug: "picnic",
        tipo: "iniciativa",
        titulo: "Picnic LAGRAM",
        imagen: null,
        descripcion: "Un día de reencuentro, juegos y tiempo al aire libre para disfrutar con toda la familia.",
        destacado: false,
        inscripcion: false
    }
];

/* =========================================
   TEMPORADA DE INSCRIPCIÓN ACTUAL
   -----------------------------------------
   Esto se edita cada temporada. Lo que está en null se muestra
   como "a confirmar" en la página de inscripción.

   estado:
   - "abierta":     se puede anotar normalmente
   - "lista-espera": se puede anotar, pero entra a la lista de espera
   - "cerrada":     el formulario no se muestra
========================================= */
const TEMPORADA = {
    nombre: "Campamentos de Verano 2027",
    estado: "abierta",
    lugar: 'Parque "El Sembrador", Máximo Paz, Buenos Aires',
    salida: "Los micros salen de Irigoyen y Tinogasta, Villa Real, CABA (Escuela ECEA)",
    inscripcion: { desde: null, hasta: null },  // ej: "2026-12-01"
    sorteo: null,                               // fecha en que se avisa quién quedó
    diasParaPagar: 5,
    contacto: "+54 9 11 6376-5990",

    // Una entrada por campamento. edadMin/edadMax arman la lista de edades del formulario.
    campamentos: [
        { slug: "10-12", edadMin: 10, edadMax: 12, fechas: null, costo: null },
        { slug: "13-15", edadMin: 13, edadMax: 15, fechas: null, costo: null },
        { slug: "16-18", edadMin: 16, edadMax: 18, fechas: null, costo: null }
    ]
};
