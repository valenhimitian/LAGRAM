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
