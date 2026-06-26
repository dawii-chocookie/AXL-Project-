const defaultSettings = {
  fullName: "Apprenant AXL",
  username: "axl_user",
  email: "",
  accountType: "Eleve",
  level: "Secondaire",
  dailyGoal: "30 min",
  reminderTime: "18:00",
  mainSubject: "Algebre",
  notifyGeneral: true,
  notifyGoals: true,
  notifyCourses: false,
  notifyWeekly: true,
  theme: "light",
  textSize: "normal",
  density: "comfortable",
  highContrast: false,
  reduceMotion: false,
  focusMode: false,
  privateProfile: false,
  localSave: true,
  startupLock: false
};

const storageKey = "axlSettings";
const fields = [
  "fullName",
  "username",
  "email",
  "accountType",
  "level",
  "dailyGoal",
  "reminderTime",
  "mainSubject",
  "notifyGeneral",
  "notifyGoals",
  "notifyCourses",
  "notifyWeekly",
  "textSize",
  "density",
  "highContrast",
  "reduceMotion",
  "focusMode",
  "privateProfile",
  "localSave",
  "startupLock"
];

let currentSettings = { ...defaultSettings };
let pendingTheme = "light";

function readStoredSettings() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    return stored && typeof stored === "object" ? stored : {};
  } catch {
    return {};
  }
}

function getSettingsFromForm() {
  const next = { ...currentSettings, theme: pendingTheme };

  fields.forEach((field) => {
    const element = document.getElementById(field);
    if (!element) return;
    next[field] = element.type === "checkbox" ? element.checked : element.value;
  });

  return next;
}

function applySettings(settings) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const useDark = settings.theme === "dark" || (settings.theme === "system" && prefersDark);

  document.body.classList.toggle("dark-mode", useDark);
  document.body.classList.toggle("light-mode", !useDark);
  document.body.classList.toggle("text-large", settings.textSize === "large");
  document.body.classList.toggle("text-xlarge", settings.textSize === "xlarge");
  document.body.classList.toggle("compact-density", settings.density === "compact");
  document.body.classList.toggle("high-contrast", Boolean(settings.highContrast));
  document.body.classList.toggle("reduce-motion", Boolean(settings.reduceMotion));
  document.body.classList.toggle("focus-mode", Boolean(settings.focusMode));

  const icon = document.getElementById("theme-icon");
  if (icon) {
    icon.className = useDark ? "fas fa-sun" : "fas fa-moon";
  }

  document.querySelectorAll("[data-theme-choice]").forEach((button) => {
    button.classList.toggle("active", button.dataset.themeChoice === settings.theme);
  });

  updateProfilePreview(settings);
}

function fillForm(settings) {
  fields.forEach((field) => {
    const element = document.getElementById(field);
    if (!element) return;

    if (element.type === "checkbox") {
      element.checked = Boolean(settings[field]);
    } else {
      element.value = settings[field] ?? "";
    }
  });
}

function updateProfilePreview(settings) {
  const name = settings.fullName?.trim() || settings.username?.trim() || "Apprenant AXL";
  const account = settings.accountType || "Eleve";
  const level = settings.level || "Secondaire";
  const initial = name.charAt(0).toUpperCase();

  document.getElementById("profileNamePreview").textContent = name;
  document.getElementById("profileMetaPreview").textContent = `${account} - ${level}`;
  document.getElementById("avatarPreview").textContent = initial || "A";
}

function setSaveStatus(message, isDirty = false) {
  const status = document.getElementById("saveStatus");
  status.textContent = message;
  status.classList.toggle("dirty", isDirty);
}

function markDirty() {
  const previewSettings = getSettingsFromForm();
  applySettings(previewSettings);
  setSaveStatus("Modifications non enregistrees.", true);
}

function saveSettings() {
  currentSettings = getSettingsFromForm();
  pendingTheme = currentSettings.theme;

  if (currentSettings.localSave) {
    localStorage.setItem(storageKey, JSON.stringify(currentSettings));
    localStorage.setItem("theme", currentSettings.theme === "system" ? "light" : currentSettings.theme);
  } else {
    localStorage.removeItem(storageKey);
  }

  applySettings(currentSettings);
  setSaveStatus("Parametres enregistres.");
}

function exportSettings() {
  const settings = getSettingsFromForm();
  const data = JSON.stringify(settings, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "axl-parametres.json";
  link.click();
  URL.revokeObjectURL(url);
  setSaveStatus("Export prepare.");
}

function resetSettings() {
  const confirmed = window.confirm("Reinitialiser les parametres de cette page ?");
  if (!confirmed) return;

  localStorage.removeItem(storageKey);
  currentSettings = { ...defaultSettings };
  pendingTheme = currentSettings.theme;
  fillForm(currentSettings);
  applySettings(currentSettings);
  setSaveStatus("Parametres reinitialises.");
}

function bindEvents() {
  fields.forEach((field) => {
    const element = document.getElementById(field);
    if (!element) return;
    element.addEventListener("input", markDirty);
    element.addEventListener("change", markDirty);
  });

  document.querySelectorAll("[data-theme-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      pendingTheme = button.dataset.themeChoice;
      markDirty();
    });
  });

  document.getElementById("theme-toggle").addEventListener("click", () => {
    pendingTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
    markDirty();
  });

  document.getElementById("saveSettings").addEventListener("click", saveSettings);
  document.getElementById("exportSettings").addEventListener("click", exportSettings);
  document.getElementById("resetSettings").addEventListener("click", resetSettings);
}

window.addEventListener("DOMContentLoaded", () => {
  currentSettings = { ...defaultSettings, ...readStoredSettings() };
  pendingTheme = currentSettings.theme;
  fillForm(currentSettings);
  applySettings(currentSettings);
  bindEvents();
  setSaveStatus("Aucune modification non enregistree.");
});
