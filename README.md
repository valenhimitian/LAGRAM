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
| **Frontend (Lógica)** | **Vanilla JavaScript** | Manipulación del DOM, consumo de API REST, Intersection Observer (ScrollSpy) y componentes dinámicos (sin dependencias de librerías como jQuery). |
| **Backend (Lógica y API)** | **Java + Spring Boot** | Creación de una API RESTful robusta, gestión de la lógica de negocio y endpoints de inscripción. |
| **Base de Datos** | **MySQL / PostgreSQL** | Almacenamiento estructurado y relacional para usuarios, eventos, proyectos e inscripciones. |
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

## 🔮 Próximos Pasos (Roadmap Backend)

* [ ] Integración de **API RESTful** construida en **Java con Spring Boot**.
* [ ] Conexión a base de datos relacional (**MySQL/PostgreSQL**) para gestión dinámica de eventos y proyectos.
* [ ] Desarrollo del sistema propio de inscripciones a campamentos (eliminando la dependencia de plataformas de terceros como Tally).
* [ ] Integración de **API RESTful** construida en **Java con Spring Boot**.



* [ ] Conexión a base de datos relacional (**MySQL/PostgreSQL**) para gestión dinámica de eventos.
* [ ] Sistema propio de inscripciones a campamentos (reemplazando plataformas de terceros).
