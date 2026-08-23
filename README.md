# domiportafolio

Semántica y estructura

Resumen del proyecto

Un sitio construido con HTML, CSS y JavaScript vanilla, con un nivel de cuidado.
Portafolio cuenta con:

Accesibilidad
Skip link para saltar la navegación con teclado
aria-live inteligente en el carrusel — anuncia solo cuando el cambio es manual, sin interrumpir con el autoplay
Roles de tabs completos (tablist, tab, tabpanel) con roving tabindex
Foco visible consistente en todos los elementos interactivos
prefers-reduced-motion respetado, con fallback de IntersectionObserver para que el contenido nunca quede oculto si el navegador no lo soporta

SEO técnico
JSON-LD estructurado (Person, knowsAbout, sameAs)
Open Graph / Twitter Cards completos, con imagen horizontal optimizada
AVIF con fallback a JPG en todas las imágenes vía <picture>

JavaScript limpio
Cero dependencias — vanilla JS puro
Manejo cuidadoso de IntersectionObserver, ResizeObserver y visibilitychange
Carrusel con pausa automática en hover, foco, scroll y pestaña oculta

Rendimiento: preconnect a fuentes, preload de la imagen hero con fetchpriority="high", loading="lazy" en imágenes secundarias, formatos AVIF con fallback a JPG.

UX del carrusel: se pausa en hover/focus, al salir del viewport, al cambiar de pestaña — nada corre de fondo innecesariamente.
Robustez del JS: fallback si no hay IntersectionObserver/ResizeObserver, recálculo de alturas en load y resize por si las fuentes web reflowan el texto.

sitio pensado no solo para verse bien, sino para funcionar bien — para todas las personas, en todos los navegadores, y para los motores de búsqueda que lo indexan.
