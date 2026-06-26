// Mode sombre / clair
document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  document.body.classList.toggle("light-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
});

// Rétablir le thème stocké
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.classList.add(savedTheme === "dark" ? "dark-mode" : "light-mode");

  // Message de bienvenue personnalisé (cookies simulés)
  const user = getCookie("username");
  if (user) {
    document.querySelector(".welcome-message").textContent = `Bienvenue à nouveau, ${user} !`;
  }
});

// 👁 Afficher / masquer mot de passe
document.querySelector(".toggle-password").addEventListener("click", function () {
  const passwordInput = document.getElementById("password");
  const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
  this.classList.toggle("fa-eye-slash");
});

// 🗨️ Assistant simple
document.getElementById("chatbot-toggle").addEventListener("click", () => {
  document.getElementById("chatbot-window").classList.toggle("hidden");
});

// 🌐 Sélecteur de langue
const translations = {
  fr: {
    login: "Connexion",
    email: "Email ou nom d’utilisateur",
    password: "Mot de passe",
    remember: "Se souvenir de moi",
    connect: "Se connecter",
    forgot: "Mot de passe oublié ?",
    create: "Créer un compte",
    welcome: "Bienvenue à nouveau"
  },
  en: {
    login: "Login",
    email: "Email or Username",
    password: "Password",
    remember: "Remember me",
    connect: "Sign In",
    forgot: "Forgot password?",
    create: "Create account",
    welcome: "Welcome back"
  },
  es: {
    login: "Iniciar sesión",
    email: "Correo o nombre de usuario",
    password: "Contraseña",
    remember: "Recuérdame",
    connect: "Conectar",
    forgot: "¿Olvidaste tu contraseña?",
    create: "Crear una cuenta",
    welcome: "¡Bienvenido de nuevo"
  }
};

document.getElementById("language").addEventListener("change", (e) => {
  const lang = e.target.value;
  const t = translations[lang];

  document.querySelector("h2").textContent = t.login;
  document.querySelector("label[for='email']").textContent = `👤 ${t.email}`;
  document.querySelector("label[for='password']").textContent = `🔒 ${t.password}`;
  document.querySelector("label[for='remember']").textContent = t.remember;
  document.querySelector(".btn-login").textContent = t.connect;

  const links = document.querySelectorAll(".login-links a");
  links[0].textContent = `🔐 ${t.forgot}`;
  links[1].textContent = `📝 ${t.create}`;
});

// Simuler cookie simple
function getCookie(name) {
  // Pour test, retourne "Alex" par défaut
  return "Alex";
}


// Thème personnalisé
document.getElementById("theme-color").addEventListener("change", function () {
  const theme = this.value;
  document.body.classList.remove("theme-default", "theme-chocolat", "theme-bois");
  document.body.classList.add(`theme-${theme}`);
  localStorage.setItem("customTheme", theme);
});

// Affichage mot de passe
document.querySelector(".toggle-password").addEventListener("click", function () {
  const input = document.getElementById("password");
  input.type = input.type === "password" ? "text" : "password";
  this.classList.toggle("fa-eye-slash");
});

// Assistant chatbot
document.getElementById("chatbot-toggle").addEventListener("click", () => {
  document.getElementById("chatbot-window").classList.toggle("hidden");
});
// Assistant chatbot esthétique
document.getElementById("chatbot-toggle").addEventListener("click", () => {
  const chatbot = document.getElementById("chatbot-window");
  chatbot.classList.toggle("visible");
});
// Toggle affichage du chatbot
document.getElementById("chatbot-toggle").addEventListener("click", () => {
  const chatbot = document.getElementById("chatbot-window");
  chatbot.classList.toggle("visible");
});

// Redirection vers page d'aide
document.getElementById("help-btn").addEventListener("click", () => {
  window.location.href = "index.html"; // Modifie si besoin
});

// help-btn
// Thème clair / sombre
document.getElementById("toggle-theme").addEventListener("click", () => {
  const body = document.body;
  body.classList.toggle("dark-mode");
  body.classList.toggle("light-mode");

  const icon = document.getElementById("toggle-theme");
  icon.textContent = body.classList.contains("dark-mode") ? "☀️" : "🌙";

  localStorage.setItem("theme", body.classList.contains("dark-mode") ? "dark" : "light");
});

// Appliquer le thème au chargement
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.classList.add(savedTheme === "dark" ? "dark-mode" : "light-mode");
});