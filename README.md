# 📄 Hoja de Requerimientos y Documento de Arquitectura Técnica

**Proyecto:** Refactorización Web — LAGRAM  
**Objetivo:** Modernizar la plataforma actual, mejorando la experiencia de usuario (UX) e interfaz (UI) en un 200%, transformándola de un folleto digital estático a una plataforma web dinámica, accesible e integral.

---

## 1. 🔍 Auditoría de Problemas & Deuda Técnica (Fase 1)

Durante la auditoría inicial de la plataforma original, se detectaron las siguientes falencias estructurales que motivan este desarrollo:

* **Ausencia de estructura semántica:** La web carecía de un Header adaptable y un Footer definido, finalizando el código de forma abrupta sin cierre semántico.
* **Contenido estático y acoplado:** La información de los proyectos/campamentos estaba *hardcodeada* en el HTML, requiriendo actualizaciones manuales poco eficientes cada temporada.
* **Fricción en la experiencia de inscripción:** El uso de herramientas de terceros (Tally) para los formularios rompía la experiencia de usuario al sacarlos de la página principal y descentralizaba los datos.

---

## 2. ⚙️ Especificación del Tech Stack (Fase 2)

Para garantizar rendimiento óptimo, mantenibilidad y escalabilidad, se seleccionó el siguiente ecosistema tecnológico:

| Capa del Sistema | Tecnología | Propósito en el Proyecto |
| :--- | :--- | :--- |
| **Frontend (Base)** | **HTML5** | Semántica web, accesibilidad (a11y) y optimización SEO. |
| **Frontend (Estilos)** | **CSS3 Moderno** | Arquitectura *Mobile-First*, Flexbox, CSS Grid, CSS Variables y Glassmorphism. |
| **Frontend (Lógica)** | **Vanilla JavaScript** | Manipulación del DOM, renderizado de eventos desde una fuente única de datos y consumo de la API de Supabase (sin librerías como jQuery). |
| **Backend y Base de Datos** | **Supabase (PostgreSQL)** | Base de datos relacional para eventos e inscripciones, API REST autogenerada y seguridad por filas (RLS) para proteger los datos de menores. |
| **Hosting** | **Netlify / Vercel** | Publicación gratuita del sitio estático. |
| **Control de Versiones** | **Git & GitHub** | Rastreabilidad del código y despliegue continuo del repositorio. |

---

## 3. 🎨 Directrices de Diseño UX/UI (Fase 3)

La interfaz se diseñó para conectar con un público adolescente, respetando la identidad institucional de la organización:

* **Paleta de Colores:** Mantenimiento del naranja y verde azulado institucionales bajo la regla **60-30-10** (60% espacios limpios/blancos, 30% verde azulado para estructura y 10% naranja para *Call To Action*).
* **Tipografía:** 
  * *Títulos:* **Poppins ExtraBold** / **Montserrat** (personalidad, peso visual y energía).
  * *Párrafos:* **Inter** (optimizada para la legibilidad en pantallas móviles).
* **Estructura de la Home (Wireframe):**
  1. **Hero Section:** Impacto visual con video de fondo en loop, capa de contraste y *Call To Action* claro.
  2. **Identidad y ADN:** Cuadrícula interactiva en CSS Grid con íconos minimalistas (SVG locales).
  3. **Proyectos y Campamentos:** Diseño basado en *Cards* dinámicas con efecto deslizante inyectadas desde JS.
  4. **El Equipo:** Carrusel de liderazgo híbrido (CSS Scroll Snap para *gestures* táctiles en móviles y controles JS en escritorio).
  5. **Footer Estructurado:** Cierre semántico con links de navegación, redes sociales, contacto directo y mapa interactivo mediante `iframe`.

---

# 🚀 Estado de la Implementación (MVP Frontend)

Implementación práctica de la primera fase del proyecto basándose estrictamente en la **Hoja de Requerimientos** detallada anteriormente.

### ✨ Mejoras e Interacciones Desarrolladas:
* **Estrategia Mobile-First:** Maquetación adaptable a cualquier resolución con rendimiento optimizado para dispositivos móviles.
* **Glassmorphism Header:** Barra de navegación fija con efecto de desenfoque de fondo y *ScrollSpy* mediante JS para indicador visual de sección activa.
* **Componentes Dinámicos:** Tarjetas e iteración de proyectos inyectados de forma dinámica manipulando el DOM a través de JavaScript.
* **Carrusel Táctil Híbrido:** Combinación de *Scroll Snap* nativo para gestos de deslizamiento en celulares y controles lógicos de navegación en escritorio.
* **Footer Estructurado:** Integración de mapa interactivo en `iframe` de Google Maps y organización de canales de contacto y redes sociales agrupados por categoría.

---

## 🧭 Decisión de arquitectura

En lugar de un backend propio en Java + Spring Boot, la primera versión usa **Supabase**:
el sitio estático se publica gratis y la base de datos, la API y la seguridad quedan en un
servicio gestionado. Motivos: costo de hosting para una organización sin fines de lucro,
manejo responsable de datos sensibles de menores (Ley 25.326) y plazo hasta la apertura
de inscripciones de verano. Un panel de administración en Spring Boot queda como posible v2.

---

## 🗓️ Inscripciones: cómo se abren y cierran

Las inscripciones se abren y cierran **solas** según las fechas cargadas en `js/datos.js`
(`TEMPORADA.inscripcion` para los campamentos de 10 a 18, `CAMPA_22_26.inscripcion` y `FILO.inscripcion`).
Sin fechas cargadas, todas quedan en "próximamente" y no se muestra ningún formulario.
El mismo estado controla los botones de Proyectos, el pop-up del Inicio y los formularios.

**Para probar sin tocar el código:**

* `?demo` en cualquier URL → muestra los formularios aunque estén cerrados, durante toda la visita (con un cartel de "Vista previa"). `?demo=no` lo apaga.
* `?hoy=2026-12-05` → simula que hoy es esa fecha, para ver cómo se comporta la página antes, durante y después de las inscripciones.

---

## 🔮 Próximos Pasos

* [x] Unificar los datos de eventos en una sola fuente (`js/datos.js`)
* [x] Página de Equipo
* [x] Formulario de inscripción propio con validación (10 a 18)
* [x] Formulario de pre-inscripción a FILO
* [x] Formulario del 22 a 26
* [ ] Tablas `eventos` e `inscripciones` en Supabase con políticas RLS
* [ ] Conectar el frontend a Supabase (`js/api.js`) y reemplazar `js/datos.js`
* [ ] Deploy en Netlify con el dominio de LAGRAM
* [ ] Imagen para compartir el link (og:image) cuando esté el dominio definitivo
