/*
  XR Studio - Interactividad principal
  Aqui se controla menu movil, enlaces de WhatsApp, animaciones al hacer scroll,
  acordeon de preguntas frecuentes y el formulario de contacto.
*/

document.body.classList.add("js-enabled");

// =========================================================
// CONFIGURACION RAPIDA
// Cambia este numero por tu WhatsApp real en formato internacional.
// Ejemplo Mexico: 5215512345678. No uses espacios, guiones ni signo +.
// =========================================================
const WHATSAPP_NUMBER = "528128663480";
const WHATSAPP_MESSAGE = "Hola XR Studio, quiero cotizar una página para mi negocio.";

// =========================================================
// WHATSAPP
// Todos los elementos con clase .whatsapp-link reciben el mismo enlace.
// Asi el boton flotante, botones de paquetes y CTA principal apuntan igual.
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
// Por ahora guarda una copia en localStorage para que puedas probarlo sin backend.
// Mas abajo esta el bloque comentado para conectarlo a Firebase Firestore.
// =========================================================
const contactForm = document.querySelector("#contactForm");
const formStatus = document.querySelector("#formStatus");

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const lead = {
    name: String(formData.get("name") || "").trim(),
    contact: String(formData.get("contact") || "").trim(),
    project: String(formData.get("project") || "").trim(),
    message: String(formData.get("message") || "").trim(),
    createdAt: new Date().toISOString(),
  };

  if (!lead.name || !lead.contact || !lead.project || !lead.message) {
    setFormStatus("Completa todos los campos para guardar tu solicitud.", false);
    return;
  }

  try {
    saveLeadLocally(lead);

    /*
      FIREBASE FIRESTORE - COMO ACTIVARLO

      1. Crea un proyecto en https://console.firebase.google.com/
      2. En "Build > Firestore Database", crea una base de datos.
      3. En "Project settings > General", agrega una app web y copia firebaseConfig.
      4. Reemplaza saveLeadLocally(lead) por saveLeadToFirebase(lead).
      5. Descomenta los imports y la funcion saveLeadToFirebase de abajo.

      Imports para poner arriba del archivo si usas type="module" en el script:

      import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
      import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

      const firebaseConfig = {
        apiKey: "TU_API_KEY",
        authDomain: "TU_PROYECTO.firebaseapp.com",
        projectId: "TU_PROYECTO",
        storageBucket: "TU_PROYECTO.appspot.com",
        messagingSenderId: "TU_SENDER_ID",
        appId: "TU_APP_ID"
      };

      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);

      async function saveLeadToFirebase(leadData) {
        await addDoc(collection(db, "leads"), {
          ...leadData,
          createdAt: serverTimestamp()
        });
      }
    */

    contactForm.reset();
    setFormStatus("Listo. Solicitud guardada localmente para prueba.", true);
  } catch (error) {
    console.error("No se pudo guardar la solicitud:", error);
    setFormStatus("No se pudo guardar. Intenta de nuevo o escríbeme por WhatsApp.", false);
  }
});

function saveLeadLocally(lead) {
  const savedLeads = JSON.parse(localStorage.getItem("xrStudioLeads") || "[]");
  savedLeads.push(lead);
  localStorage.setItem("xrStudioLeads", JSON.stringify(savedLeads));
}

function setFormStatus(message, isSuccess) {
  if (!formStatus) return;

  formStatus.textContent = message;
  formStatus.style.color = isSuccess ? "var(--cyan)" : "#ff9dbd";
}
