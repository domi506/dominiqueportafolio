const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  // sin soporte de IntersectionObserver, mostrar el contenido
  // directamente en vez de dejarlo oculto para siempre
  revealEls.forEach((el) => el.classList.add("in"));
}
// accordion
function setAccordionPanelHeight(panel, isOpen) {
  if (!panel) return;
  panel.style.maxHeight = isOpen ? panel.scrollHeight + "px" : "0px";
}

document.querySelectorAll(".accordion-item").forEach((item) => {
  const panel = item.querySelector("p");
  setAccordionPanelHeight(panel, item.classList.contains("active"));
});

// recalcular el panel activo cuando termine de cargar todo (fuentes web)
// por si el alto real del texto cambió tras el reflow, igual que en el
// carrusel de testimonios
window.addEventListener("load", () => {
  const activePanel = document.querySelector(".accordion-item.active p");
  setAccordionPanelHeight(activePanel, true);
});

// respaldo del caso anterior: si el contenido del panel activo cambia de
// tamaño por cualquier motivo (fuente que carga tarde, zoom, etc.), se
// vuelve a medir sin depender únicamente de los eventos load/resize
if ("ResizeObserver" in window) {
  const accordionResizeObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const panel = entry.target;
      if (panel.closest(".accordion-item.active")) {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });
  document
    .querySelectorAll(".accordion-item p")
    .forEach((panel) => accordionResizeObserver.observe(panel));
}

document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const item = trigger.closest(".accordion-item");
    document.querySelectorAll(".accordion-item").forEach((i) => {
      const isTarget = i === item;
      const btn = i.querySelector(".accordion-trigger");
      const panel = i.querySelector("p");
      i.classList.toggle("active", isTarget);
      btn.setAttribute("aria-expanded", isTarget ? "true" : "false");
      setAccordionPanelHeight(panel, isTarget);
      // el panel colapsado no debe ser leído por lectores de pantalla
      if (panel) {
        if (isTarget) panel.removeAttribute("aria-hidden");
        else panel.setAttribute("aria-hidden", "true");
      }
    });
  });
});

// recalcular alturas abiertas si cambia el ancho de ventana
// (el texto puede reflowar a más o menos líneas)
window.addEventListener("resize", () => {
  document.querySelectorAll(".accordion-item.active p").forEach((panel) => {
    panel.style.maxHeight = "none";
    void panel.offsetHeight; // forzar reflow antes de medir
    panel.style.maxHeight = panel.scrollHeight + "px";
  });
});
// menú hamburguesa
const burger = document.querySelector(".burger");
const navMenu = document.querySelector(".nav-links");

if (burger && navMenu) {
  const openMenu = () => {
    navMenu.classList.add("open");
    burger.classList.add("open");
    burger.textContent = "✕";
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Cerrar menú de navegación");
  };

  const closeMenu = ({ focusBurger = false } = {}) => {
    navMenu.classList.remove("open");
    burger.classList.remove("open");
    burger.textContent = "☰";
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Abrir menú de navegación");
    if (focusBurger) burger.focus();
  };

  burger.addEventListener("click", () => {
    if (navMenu.classList.contains("open")) closeMenu();
    else openMenu();
  });

  // cerrar el menú al hacer clic en un link (mobile)
  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  // cerrar con Escape y devolver el foco al botón
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu.classList.contains("open")) {
      closeMenu({ focusBurger: true });
    }
  });

  // cerrar si se hace clic fuera del menú abierto
  document.addEventListener("click", (e) => {
    if (
      navMenu.classList.contains("open") &&
      !navMenu.contains(e.target) &&
      !burger.contains(e.target)
    ) {
      closeMenu();
    }
  });
}

// carrusel de comentarios (testimonial)
const tQuotes = document.querySelectorAll(".testimonial .quote");
const tDots = document.querySelectorAll(".testimonial .dots button");
const tPrev = document.querySelector(".t-prev");
const tNext = document.querySelector(".t-next");
const tPlayPause = document.querySelector(".t-playpause");
let tIndex = 0;
let tAutoplay;
let tUserPaused = false;
let tInView = true;
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const tTrack = document.querySelector(".testimonial .t-track");

function setTestimonialTrackHeight() {
  if (!tTrack) return;
  const active = tTrack.querySelector(".quote.active");
  if (active) tTrack.style.height = active.scrollHeight + "px";
}

function goToTestimonial(index, { manual = false } = {}) {
  if (!tQuotes.length) return;
  tIndex = (index + tQuotes.length) % tQuotes.length;
  tQuotes.forEach((q, i) => {
    const isActive = i === tIndex;
    q.classList.toggle("active", isActive);
    // ocultar de lectores de pantalla las citas no visibles
    if (isActive) q.removeAttribute("aria-hidden");
    else q.setAttribute("aria-hidden", "true");
  });
  tDots.forEach((d, i) => {
    d.classList.toggle("active", i === tIndex);
    d.setAttribute("aria-selected", i === tIndex ? "true" : "false");
    // roving tabindex: solo el dot activo es alcanzable con Tab,
    // el resto se navega con las flechas (patrón ARIA tabs)
    d.setAttribute("tabindex", i === tIndex ? "0" : "-1");
  });
  // el autoplay no debe interrumpir al lector de pantalla;
  // solo se anuncia cuando el cambio lo pide la persona usuaria
  if (tTrack) tTrack.setAttribute("aria-live", manual ? "polite" : "off");
  setTestimonialTrackHeight();
}

function startTestimonialAutoplay() {
  clearInterval(tAutoplay);
  if (tUserPaused || prefersReducedMotion || !tInView) return;
  tAutoplay = setInterval(() => goToTestimonial(tIndex + 1), 6000);
}

function setPlayPauseUI(isPaused) {
  if (!tPlayPause) return;
  tPlayPause.setAttribute("aria-pressed", isPaused ? "true" : "false");
  tPlayPause.setAttribute(
    "aria-label",
    isPaused ? "Reanudar avance automático de comentarios" : "Pausar avance automático de comentarios",
  );
  const icon = tPlayPause.querySelector(".t-pp-icon");
  if (icon) icon.textContent = isPaused ? "▶" : "⏸";
}

if (tQuotes.length) {
  // si la persona prefiere menos movimiento, no arrancamos el avance
  // automático solo; puede reanudarlo con el botón si quiere
  if (prefersReducedMotion) {
    tUserPaused = true;
    setPlayPauseUI(true);
  }

  // altura inicial del track según la cita activa
  setTestimonialTrackHeight();
  window.addEventListener("resize", setTestimonialTrackHeight);
  // recalcular una vez más cuando termine de cargar todo (fuentes web,
  // imágenes) por si el alto real del texto cambió tras el reflow
  window.addEventListener("load", setTestimonialTrackHeight);

  tNext?.addEventListener("click", () => {
    goToTestimonial(tIndex + 1, { manual: true });
    startTestimonialAutoplay();
  });
  tPrev?.addEventListener("click", () => {
    goToTestimonial(tIndex - 1, { manual: true });
    startTestimonialAutoplay();
  });
  tDots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      goToTestimonial(i, { manual: true });
      startTestimonialAutoplay();
    });
    // navegación con flechas entre los dots, como en un patrón de tabs estándar
    dot.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const nextIndex = e.key === "ArrowRight" ? i + 1 : i - 1;
        const target = tDots[(nextIndex + tDots.length) % tDots.length];
        target.focus();
        goToTestimonial(nextIndex, { manual: true });
        startTestimonialAutoplay();
      }
    });
  });

  // botón de pausa/reproducción manual: da control explícito del
  // contenido en movimiento automático, sin depender de hover/focus
  tPlayPause?.addEventListener("click", () => {
    tUserPaused = !tUserPaused;
    setPlayPauseUI(tUserPaused);
    if (tUserPaused) clearInterval(tAutoplay);
    else startTestimonialAutoplay();
  });

  startTestimonialAutoplay();

  // pausar autoplay al pasar el mouse o al enfocar con teclado
  // (respeta la pausa manual: si la persona pausó a propósito, no se reanuda solo)
  const tCarousel = document.querySelector(".testimonial-carousel");
  tCarousel?.addEventListener("mouseenter", () => clearInterval(tAutoplay));
  tCarousel?.addEventListener("mouseleave", startTestimonialAutoplay);
  tCarousel?.addEventListener("focusin", () => clearInterval(tAutoplay));
  tCarousel?.addEventListener("focusout", (e) => {
    if (!tCarousel.contains(e.relatedTarget)) startTestimonialAutoplay();
  });

  // pausar autoplay cuando la pestaña no está visible, para no
  // gastar ciclos ni "saltar" comentarios al volver a la pestaña
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearInterval(tAutoplay);
    else if (tInView) startTestimonialAutoplay();
  });

  // pausar autoplay cuando el carrusel sale del viewport por scroll,
  // así no sigue corriendo de fondo mientras la persona lee otra sección
  if ("IntersectionObserver" in window) {
    const tVisibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          tInView = entry.isIntersecting;
          if (tInView) startTestimonialAutoplay();
          else clearInterval(tAutoplay);
        });
      },
      { threshold: 0.2 },
    );
    tVisibilityObserver.observe(tCarousel);
  }

  // navegación con flechas del teclado cuando el carrusel tiene el foco
  tCarousel?.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goToTestimonial(tIndex + 1, { manual: true });
      startTestimonialAutoplay();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goToTestimonial(tIndex - 1, { manual: true });
      startTestimonialAutoplay();
    }
  });
}

// formulario de contacto
const contactForm = document.querySelector("#contact-form");
contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  // agregamos la clase "submitted" recién al intentar enviar, así los
  // campos vacíos no se marcan en rojo antes de que la persona intente
  contactForm.classList.add("submitted");
  if (!contactForm.checkValidity()) {
    contactForm.querySelector(":invalid")?.focus();
    return;
  }
  contactForm.querySelector(".btn").textContent = "Enviado ✓";
});

// nav active link on scroll
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + entry.target.id,
          );
        });
      }
    });
  },
  { rootMargin: "-120px 0px -70% 0px" },
);
sections.forEach((sec) => navObserver.observe(sec));

// año del copyright y del hero siempre actualizados
const currentYear = new Date().getFullYear();
const yearEl = document.querySelector("#year");
if (yearEl) yearEl.textContent = currentYear;
const heroYearEl = document.querySelector("#hero-year");
if (heroYearEl) heroYearEl.textContent = currentYear;
