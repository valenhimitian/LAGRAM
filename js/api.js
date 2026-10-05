/* =========================================
   API (comunicación con la base de datos)
   -----------------------------------------
   Todo lo que hable con Supabase va a vivir en este archivo.
   El resto del código solo llama a estas funciones, así que cuando
   conectemos la base de datos real, solo cambia lo de acá adentro.
========================================= */

// TODO (Supabase): reemplazar por el insert real en la tabla "inscripciones".
// Mientras tanto la inscripción NO se guarda en ningún lado: solo se muestra
// en la consola del navegador para poder probar el formulario.
async function enviarInscripcion(inscripcion) {
    console.warn("[MODO PRUEBA] La inscripción no se guardó. Datos que se enviarían:", inscripcion);

    // Simulamos la demora de una conexión real
    await new Promise(resolver => setTimeout(resolver, 600));

    return { ok: true, modoPrueba: true };
}
