// script.js

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');

  // Optionnel : Sauvegarde du thème en localStorage
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function changeLanguage() {
  const lang = document.getElementById('languageSelect').value;

  const translations = {
    fr: {
      title: "Bienvenue sur AXL, ton assistant intelligent",
      slogan: "Choisis une action ci-dessous pour commencer ta journée !",
      revise: "Réviser une matière",
      descRevise: "Choisis une matière et commence à apprendre avec des fiches, résumés ou vidéos.",
      quiz: "Faire un quiz",
      descQuiz: "Teste tes connaissances avec un quiz adapté à ton niveau.",
      goal: "Fixer un objectif",
      descGoal: "Planifie ta réussite en définissant un objectif pour aujourd’hui ou la semaine."
    },
    en: {
      title: "Welcome to AXL, your smart assistant",
      slogan: "Pick an action below to start your day!",
      revise: "Review a subject",
      descRevise: "Choose a subject and start learning with notes, summaries or videos.",
      quiz: "Take a quiz",
      descQuiz: "Test your knowledge with a quiz suited to your level.",
      goal: "Set a goal",
      descGoal: "Plan your success by setting a goal for today or the week."
    },
    es: {
      title: "Bienvenido a AXL, tu asistente inteligente",
      slogan: "¡Elige una acción para comenzar tu día!",
      revise: "Repasar una materia",
      descRevise: "Elige una materia y empieza a aprender con fichas, resúmenes o videos.",
      quiz: "Hacer un quiz",
      descQuiz: "Pon a prueba tus conocimientos con un quiz adaptado a tu nivel.",
      goal: "Fijar un objetivo",
      descGoal: "Planifica tu éxito definiendo un objetivo para hoy o la semana."
    }
  };

  const t = translations[lang];

  document.getElementById('main-title').innerText = t.title;
  document.getElementById('slogan').innerText = t.slogan;
  document.getElementById('option-revise').innerText = t.revise;
  document.getElementById('desc-revise').innerText = t.descRevise;
  document.getElementById('option-quiz').innerText = t.quiz;
  document.getElementById('desc-quiz').innerText = t.descQuiz;
  document.getElementById('option-goal').innerText = t.goal;
  document.getElementById('desc-goal').innerText = t.descGoal;
}

// Appliquer le thème au chargement
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }
});