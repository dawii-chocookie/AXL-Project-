const translations = {
  fr: {
    heroEyebrow: "Tableau de bord",
    heroTitle: "Visualise ce qui avance et ce qui merite ton attention.",
    heroText: "Garde une vue claire sur tes cours, tes efforts de la semaine et les prochaines priorites.",
    globalProgress: "Progression generale",
    completedModules: "Modules termines",
    totalModules: "Modules suivis",
    averageRate: "Progression moyenne",
    streak: "Jours actifs",
    overview: "Vue globale",
    chartTitle: "Avancement total",
    done: "complete",
    subjects: "Matieres",
    modulesTitle: "Progression par module",
    algebra: "Algebre",
    grammar: "Grammaire",
    history: "Histoire",
    physics: "Physique",
    chemistry: "Chimie",
    rhythm: "Rythme",
    weeklyTitle: "Activite de la semaine",
    next: "Priorites",
    nextTitle: "A faire ensuite",
    taskOne: "Terminer 2 exercices d'algebre.",
    taskTwo: "Revoir les bases de chimie.",
    taskThree: "Faire une session de 20 minutes aujourd'hui.",
    completed: "Complete",
    remaining: "Restant"
  },
  en: {
    heroEyebrow: "Dashboard",
    heroTitle: "See what is moving forward and what needs attention.",
    heroText: "Keep a clear view of your courses, weekly effort, and next priorities.",
    globalProgress: "Overall progress",
    completedModules: "Completed modules",
    totalModules: "Tracked modules",
    averageRate: "Average progress",
    streak: "Active days",
    overview: "Overview",
    chartTitle: "Total progress",
    done: "complete",
    subjects: "Subjects",
    modulesTitle: "Progress by module",
    algebra: "Algebra",
    grammar: "Grammar",
    history: "History",
    physics: "Physics",
    chemistry: "Chemistry",
    rhythm: "Rhythm",
    weeklyTitle: "Weekly activity",
    next: "Priorities",
    nextTitle: "Next steps",
    taskOne: "Finish 2 algebra exercises.",
    taskTwo: "Review chemistry basics.",
    taskThree: "Do a 20-minute session today.",
    completed: "Completed",
    remaining: "Remaining"
  },
  es: {
    heroEyebrow: "Panel",
    heroTitle: "Mira lo que avanza y lo que necesita atencion.",
    heroText: "Mantén una vista clara de tus cursos, tu esfuerzo semanal y tus prioridades.",
    globalProgress: "Progreso general",
    completedModules: "Modulos completados",
    totalModules: "Modulos seguidos",
    averageRate: "Progreso promedio",
    streak: "Dias activos",
    overview: "Vista global",
    chartTitle: "Avance total",
    done: "completo",
    subjects: "Materias",
    modulesTitle: "Progreso por modulo",
    algebra: "Algebra",
    grammar: "Gramatica",
    history: "Historia",
    physics: "Fisica",
    chemistry: "Quimica",
    rhythm: "Ritmo",
    weeklyTitle: "Actividad semanal",
    next: "Prioridades",
    nextTitle: "Siguiente",
    taskOne: "Terminar 2 ejercicios de algebra.",
    taskTwo: "Repasar las bases de quimica.",
    taskThree: "Hacer una sesion de 20 minutos hoy.",
    completed: "Completado",
    remaining: "Restante"
  }
};

let progressChart = null;

function toggleDarkMode() {
  const isDark = document.body.classList.toggle("dark-mode");
  const icon = document.getElementById("theme-icon");

  icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
  localStorage.setItem("theme", isDark ? "dark" : "light");
  renderChart();
}

function changeLanguage() {
  const lang = document.getElementById("languageSelect").value;
  localStorage.setItem("lang", lang);
  applyLanguage(lang);
  renderChart();
}

function applyLanguage(lang) {
  const dictionary = translations[lang] || translations.fr;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (dictionary[key]) {
      element.textContent = dictionary[key];
    }
  });
}

function restoreSettings() {
  const theme = localStorage.getItem("theme") || "light";
  const lang = localStorage.getItem("lang") || "fr";
  const icon = document.getElementById("theme-icon");

  document.body.classList.toggle("dark-mode", theme === "dark");
  document.body.classList.toggle("light-mode", theme !== "dark");
  icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
  document.getElementById("languageSelect").value = lang;
  applyLanguage(lang);
}

function getModuleProgress() {
  return [...document.querySelectorAll(".module")].map((module) => {
    const progress = Number(module.dataset.progress) || 0;
    return Math.max(0, Math.min(progress, 100));
  });
}

function loadProgressData() {
  const progressValues = getModuleProgress();
  const totalModules = progressValues.length;
  const completedModules = progressValues.filter((value) => value >= 100).length;
  const averageProgress = totalModules
    ? Math.round(progressValues.reduce((sum, value) => sum + value, 0) / totalModules)
    : 0;

  document.getElementById("completedCount").textContent = completedModules;
  document.getElementById("totalCount").textContent = totalModules;
  document.getElementById("completionRate").textContent = `${averageProgress}%`;
  document.getElementById("heroRate").textContent = `${averageProgress}%`;
  document.getElementById("chartRate").textContent = `${averageProgress}%`;
  document.getElementById("heroFill").style.width = `${averageProgress}%`;

  document.querySelectorAll(".module").forEach((module) => {
    const value = Number(module.dataset.progress) || 0;
    const fill = module.querySelector(".progress-bar span");
    const label = module.querySelector(".module-top strong");

    fill.style.width = `${value}%`;
    label.textContent = `${value}%`;
  });

  renderChart(averageProgress);
}

function renderChart(currentAverage) {
  const averageProgress = typeof currentAverage === "number"
    ? currentAverage
    : Number(document.getElementById("chartRate").textContent.replace("%", "")) || 0;
  const isDark = document.body.classList.contains("dark-mode");
  const lang = localStorage.getItem("lang") || "fr";
  const dictionary = translations[lang] || translations.fr;
  const canvas = document.getElementById("progressChart");

  if (!canvas || typeof Chart === "undefined") return;

  if (progressChart) {
    progressChart.destroy();
  }

  progressChart = new Chart(canvas.getContext("2d"), {
    type: "doughnut",
    data: {
      labels: [dictionary.completed, dictionary.remaining],
      datasets: [{
        data: [averageProgress, 100 - averageProgress],
        backgroundColor: ["#DB2777", isDark ? "#334155" : "#FDF2F8"],
        borderColor: isDark ? "#1E293B" : "#FFFFFF",
        borderWidth: 4
      }]
    },
    options: {
      cutout: "72%",
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => `${context.label}: ${context.parsed}%`
          }
        }
      }
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  restoreSettings();
  loadProgressData();
});
