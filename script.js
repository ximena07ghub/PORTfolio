/*
  XR Studio - Interactividad principal.
  Controla menu movil, enlaces de WhatsApp, animaciones y FAQ.
*/

document.body.classList.add("js-enabled");

// =========================================================
// CONFIGURACION RAPIDA
// Cambia este numero por tu WhatsApp real en formato internacional.
// Ejemplo Mexico: 5215512345678. No uses espacios, guiones ni signo +.
// =========================================================
const WHATSAPP_NUMBER = "528128663480";
const WHATSAPP_MESSAGE = "Hola XR Studio, quiero cotizar una pagina para mi negocio.";

// =========================================================
// WHATSAPP
// Todos los elementos con clase .whatsapp-link reciben el mismo enlace.
// =========================================================
const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

document.querySelectorAll(".whatsapp-link").forEach((link) => {
  link.setAttribute("href", whatsappUrl);
});

// =========================================================
// MENU MOVIL
// Abre/cierra el menu en celular y lo cierra al elegir una seccion.
// =========================================================
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".main-nav a");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("nav-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

// =========================================================
// ANIMACION AL SCROLL
// Muestra cada bloque suavemente cuando entra en pantalla.
// =========================================================
const revealItems = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14,
    rootMargin: "0px 0px -70px 0px",
  }
);

revealItems.forEach((item) => {
  const rect = item.getBoundingClientRect();

  if (rect.top < window.innerHeight && rect.bottom > 0) {
    item.classList.add("is-visible");
  } else {
    revealObserver.observe(item);
  }
});

// =========================================================
// FAQ / PREGUNTAS FRECUENTES
// Acordeon accesible: actualiza aria-expanded y clases visuales.
// =========================================================
document.querySelectorAll(".faq-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const isOpen = item.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
});
