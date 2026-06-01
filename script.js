/*
  XR Digital - Interactividad principal.
  Controla menu movil, enlaces de WhatsApp, animaciones, FAQ y formulario.
*/

document.body.classList.add("js-enabled");

// =========================================================
// CONFIGURACION RAPIDA
// Cambia este numero por tu WhatsApp real en formato internacional.
// Ejemplo Mexico: 5215512345678. No uses espacios, guiones ni signo +.
// =========================================================
const WHATSAPP_NUMBER = "528128663480";
const WHATSAPP_MESSAGE = "Hola XR Digital, quiero cotizar una pagina para mi negocio.";

// =========================================================
// EMAILJS
// La clave publica puede vivir en frontend; nunca pongas aqui la clave privada.
// =========================================================
const EMAILJS_SERVICE_ID = "portafolio_id";
const EMAILJS_TEMPLATE_ID = "template_yehhb3n";
const EMAILJS_PUBLIC_KEY = "N-65HjyUrrhrD9JXy";

if (window.emailjs) {
  window.emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY,
  });
}

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

// =========================================================
// FORMULARIO DE CONTACTO
// Envia solicitudes al correo configurado en EmailJS.
// =========================================================
const contactForm = document.querySelector("#contactForm");
const formStatus = document.querySelector("#formStatus");
const createdAtInput = document.querySelector("#createdAt");
const submitButton = contactForm?.querySelector('button[type="submit"]');

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const lead = {
    name: String(formData.get("name") || "").trim(),
    contact: String(formData.get("contact") || "").trim(),
    project: String(formData.get("project") || "").trim(),
    message: String(formData.get("message") || "").trim(),
  };

  if (!lead.name || !lead.contact || !lead.project || !lead.message) {
    setFormStatus("Completa todos los campos para enviar tu solicitud.", false);
    return;
  }

  if (!window.emailjs) {
    setFormStatus("No se pudo cargar el servicio de correo. Escribeme por WhatsApp.", false);
    return;
  }

  if (createdAtInput) {
    createdAtInput.value = new Date().toLocaleString("es-MX", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  try {
    setSubmitState(true);
    setFormStatus("Enviando...", true);

    await window.emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactForm);

    contactForm.reset();
    setFormStatus("Solicitud enviada. Te respondere pronto.", true);
  } catch (error) {
    console.error("No se pudo enviar la solicitud:", error);
    setFormStatus("No se pudo enviar. Escribeme por WhatsApp.", false);
  } finally {
    setSubmitState(false);
  }
});

function setFormStatus(message, isSuccess) {
  if (!formStatus) return;

  formStatus.textContent = message;
  formStatus.style.color = isSuccess ? "var(--cyan)" : "#ff9dbd";
}

function setSubmitState(isSending) {
  if (!submitButton) return;

  submitButton.disabled = isSending;
  submitButton.textContent = isSending ? "Enviando..." : "Enviar solicitud";
}
