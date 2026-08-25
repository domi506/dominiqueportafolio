# domiportafolio

## Semántica, accesibilidad y estructura

### Resumen del proyecto

Sitio web desarrollado con **HTML, CSS y JavaScript Vanilla**, diseñado con un enfoque integral en **accesibilidad, rendimiento, SEO técnico, experiencia de usuario y compatibilidad entre navegadores**.

El proyecto incorpora las siguientes características:

### ♿ Accesibilidad

- **Skip link** para permitir a usuarios de teclado saltar directamente al contenido principal.
- Uso de **ARIA** y `aria-live` en el carrusel, anunciando únicamente los cambios realizados manualmente para evitar interrupciones durante el autoplay.
- Implementación completa de **tabs accesibles**, utilizando `tablist`, `tab` y `tabpanel`, junto con **roving tabindex** para una navegación eficiente mediante teclado.
- **Indicadores de foco visibles y consistentes** en todos los elementos interactivos.
- Respeto por la preferencia del usuario mediante `prefers-reduced-motion`.
- **Fallback con IntersectionObserver**, garantizando que el contenido permanezca accesible incluso en navegadores que no soporten determinadas funcionalidades.

### 🔎 SEO técnico

- Implementación de **datos estructurados JSON-LD**, incluyendo información de tipo `Person`, `knowsAbout` y `sameAs`.
- Configuración de **Open Graph** y **Twitter Cards** para optimizar la visualización del sitio al compartirlo en redes sociales.
- Optimización de imágenes mediante **AVIF**, incorporando fallback a **JPG** para garantizar compatibilidad.

### 💻 JavaScript y arquitectura

- Desarrollo utilizando **JavaScript Vanilla**, sin dependencias ni frameworks externos.
- Gestión eficiente de `IntersectionObserver`, `ResizeObserver` y `visibilitychange`.
- Carrusel con comportamiento inteligente, incluyendo pausa automática al:
  - Pasar el cursor sobre el componente.
  - Recibir foco mediante teclado.
  - Salir del viewport.
  - Cambiar de pestaña o minimizar la ventana.

- Implementación de **fallbacks** para navegadores que no soporten `IntersectionObserver` o `ResizeObserver`.
- Recalculado dinámico de alturas durante `load` y `resize`, considerando posibles cambios de layout provocados por la carga de fuentes web.

### ⚡ Rendimiento

- Uso de `preconnect` para optimizar la conexión con recursos externos.
- `preload` de la imagen principal del hero.
- Uso de `fetchpriority="high"` para priorizar el recurso visual principal.
- Aplicación de `loading="lazy"` en imágenes secundarias.
- Optimización mediante formatos de imagen modernos como **AVIF**, con fallback a JPG.

### 🎯 Experiencia de usuario y robustez

El sitio fue concebido no solo para ofrecer una **interfaz visual atractiva**, sino también para proporcionar una experiencia **rápida, accesible, robusta y eficiente**.

Cada componente está pensado para funcionar correctamente en diferentes dispositivos, navegadores y condiciones de uso, evitando ejecuciones innecesarias en segundo plano y respetando las preferencias de accesibilidad de cada usuario.

El resultado es un sitio que combina **diseño, desarrollo frontend, accesibilidad, SEO técnico y optimización de rendimiento**, buscando entregar una experiencia de calidad tanto para las personas usuarias como para los motores de búsqueda.
