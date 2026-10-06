/* =========================================
   DETALLE DE CADA PROPUESTA (página evento.html?e=slug)
   -----------------------------------------
   Textos copiados de las páginas originales de LAGRAM.

   - secciones:      preguntas y respuestas que se muestran siempre.
                     Las respuestas pueden tener HTML simple (<strong>, <ul>...).
                     OJO: esto es HTML de confianza (lo escribimos nosotros).
                     Si algún día viene de la base de datos, hay que limpiarlo.
   - ultimaEdicion:  dónde y cuándo fue la última vez (texto).
   - proximaEdicion: null = "todavía no tiene fecha". Cuando LAGRAM confirme
                     la próxima, se escribe acá (fecha, lugar, costo...).

   Lo que es de una edición puntual (fecha, lugar, precio, cómo pagar)
   NO va en secciones, así la página nunca muestra datos viejos como si
   fueran actuales.

   Si una propuesta no está acá, la página muestra un cartel de
   "todavía no tenemos más información".
========================================= */
const DETALLES = {

    expocarreras: {
        secciones: [
            {
                pregunta: "¿Qué es la Expo Carreras?",
                respuesta: "<p>Es un espacio pensado especialmente para vos con propuestas para que explores algunos puntos que creemos importantes en el desarrollo de tu vida vocacional. Vas a encontrar talleres temáticos, espacios para reflexionar y hacer preguntas, y stands con profesionales de múltiples disciplinas que van a estar a disposición para contarte todo acerca de su camino profesional.</p>"
            },
            {
                pregunta: "¿Puedo ir si no fui a un campamento de lagram?",
                respuesta: "<p>¡POR SUPUESTO! La vas a pasar INCREÍBLE, es una hermosa oportunidad para conocernos y para que pases un día genial con todo lo que estamos preparando para vos.</p>"
            },
            {
                pregunta: "¿Cómo es la dinámica?",
                respuesta: "<p>Vamos a pasar un día entre amigos, aprendiendo juntos y compartiendo diferentes espacios con mucha info para tu futuro vocacional y profesional. Habrá talleres temáticos para que elijas el que más se adapte a las herramientas que necesitás y experiencias digitales con profesionales de distintas disciplinas para que sueñes tu futuro vocacional. Además vamos a cerrar este día con una serie de charlas que creemos que te van a desafiar para lo que viene.</p>"
            },
            {
                pregunta: "¿Puedo invitar amigos/as?",
                respuesta: "<p>¡OBVIO! Podés traer a todos los amigos que quieras. Recordá compartirles el link para que puedan anotarse y pagar porque los cupos son limitados.</p>"
            },
            {
                pregunta: "¿Hay un límite de edad?",
                respuesta: "<p>Para poder participar tenés que tener entre 16 y 26 años.</p>"
            }
        ],
        ultimaEdicion: "La última Expo Carreras fue el sábado 29 de agosto de 2026 en la Universidad Evangélica (Av. Eva Perón 1060 - CABA).",
        proximaEdicion: null
    },

    picnic: {
        secciones: [
            {
                pregunta: "¿Qué es el día de PICNIC?",
                respuesta: "<p>Un día al aire libre, una escapada con amigos, rica comida, matecitos, charlitas, deportes y juegos. En fin, un planazo. Una hermosa propuesta para cerrar el verano con todo.</p>"
            },
            {
                pregunta: "¿Puedo ir si no fui a un campamento de lagram?",
                respuesta: "<p>¡POR SUPUESTO! La vas a pasar INCREÍBLE, es una hermosa oportunidad para conocernos y para que pases un día genial con todo lo que estamos preparando para vos.</p>"
            },
            {
                pregunta: "¿Puedo invitar amigos/as?",
                respuesta: "<p>¡OBVIO! Podés traer a todos los amigos que quieras. Recordá compartirles el link para que puedan anotarse y pagar porque los cupos son limitados.</p>"
            },
            {
                pregunta: "¿Hay un límite de edad?",
                respuesta: "<p>Para poder participar tenés que tener entre 10 y 15 años.</p>"
            }
        ],
        ultimaEdicion: "El último Picnic fue el sábado 14 de marzo de 2026 en Intendente Tulissi 4734, Francisco Álvarez \"El federal\".",
        proximaEdicion: null
    },

    feriadito: {
        secciones: [
            {
                pregunta: "¿Qué es Feriadito?",
                respuesta: "<p>Es una propuesta nueva, que te invita a desconectar de la rutina para pasar un día rodeado de gente del bien, comiendo rico, en modo chill, con cafecito y/o matecito de por medio y charlando de la vida, como lo harías en cualquier FERIADITO.</p>"
            },
            {
                pregunta: "¿Puedo ir si no fui a un campamento de lagram?",
                respuesta: "<p>¡POR SUPUESTO! La vas a pasar INCREÍBLE, es una hermosa oportunidad para conocernos y para que pases un día genial con todo lo que estamos preparando para vos.</p>"
            },
            {
                pregunta: "¿Puedo invitar amigos/as?",
                respuesta: "<p>¡OBVIO! Podés traer a todos los amigos que quieras. Recordá compartirles el link para que puedan anotarse y pagar porque los cupos son limitados.</p>"
            },
            {
                pregunta: "¿Hay un límite de edad?",
                respuesta: "<p>Para poder participar tenés que tener entre 19 y 26 años.</p>"
            }
        ],
        ultimaEdicion: "El último Feriadito fue el sábado 11 de abril de 2026 en Agustín Álvarez 1740.",
        proximaEdicion: null
    },

    // Propuesta que ya no se hace: textos en pasado y sin costo ni inscripción
    arte: {
        secciones: [
            {
                pregunta: "¿Qué era lagram arte?",
                respuesta: "<p>Un día entero para explorar nuestra creatividad juntos en diferentes formas de hacer arte, usarlas para expresarnos y hacer crecer nuestra relación con Dios.</p>"
            },
            {
                pregunta: "¿Qué talleres había?",
                respuesta: `<ul>
                    <li>Dibujo &amp; Lettering</li>
                    <li>Pintura</li>
                    <li>Música</li>
                    <li>Escritura</li>
                    <li>Fotografía y creación de contenido</li>
                    <li>Arcilla y modelado</li>
                </ul>`
            },
            {
                pregunta: "¿Para quién era?",
                respuesta: "<p>Para chicos y chicas de entre 10 y 18 años. No hacía falta ser un \"genio\" del arte: era un evento para disfrutar muchísimo, sea cual sea la relación que tengas con el arte.</p>"
            }
        ],
        ultimaEdicion: "La última edición fue el sábado 29 de junio de 2024 en Corvalán 1645, Mataderos - CABA (Iglesia Juntos)."
    }

    // lagrampiada y gamers: todavía sin información → la página muestra un cartel
};
