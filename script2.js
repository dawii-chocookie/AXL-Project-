const STORAGE_KEY = "axlObjectifs";

const defaultState = {
  intention: "",
  mainGoal: "",
  tasks: [],
  datedGoals: {},
  archives: [],
  theme: "light",
  filter: "all"
};

const priorityLabels = {
  high: "Important",
  medium: "Normal",
  low: "Leger"
};

let state = normalizeState(loadState());
let currentMonth = new Date();
let selectedDate = formatDate(new Date());

document.addEventListener("DOMContentLoaded", () => {
  bindEvents();
  applyTheme();
  renderAll();
});

function bindEvents() {
  document.getElementById("theme-toggle").addEventListener("click", toggleDarkMode);
  document.querySelector(".menu-toggle").addEventListener("click", () => {
    document.querySelector(".nav-links").classList.toggle("open");
  });

  document.getElementById("intention-form").addEventListener("submit", event => {
    event.preventDefault();
    state.intention = document.getElementById("monthly-intention").value.trim();
    saveAndRender();
  });

  document.getElementById("main-goal-form").addEventListener("submit", event => {
    event.preventDefault();
    const input = document.getElementById("main-goal");
    const value = input.value.trim();
    if (!value) return;
    state.mainGoal = value;
    input.value = "";
    saveAndRender();
  });

  document.getElementById("task-form").addEventListener("submit", event => {
    event.preventDefault();
    addTaskFromForm();
  });

  document.querySelectorAll("[data-template]").forEach(button => {
    button.addEventListener("click", () => {
      addTask(button.dataset.template, "medium", formatDate(new Date()));
    });
  });

  document.querySelectorAll("[data-filter]").forEach(button => {
    button.addEventListener("click", () => {
      state.filter = button.dataset.filter;
      saveAndRender();
    });
  });

  document.getElementById("daily-form").addEventListener("submit", event => {
    event.preventDefault();
    const input = document.getElementById("daily-input");
    const text = input.value.trim();
    if (!text || !selectedDate) return;

    if (!state.datedGoals[selectedDate]) {
      state.datedGoals[selectedDate] = [];
    }

    state.datedGoals[selectedDate].push({
      id: createId(),
      text,
      completed: false
    });
    input.value = "";
    saveAndRender();
  });

  document.getElementById("prev-month").addEventListener("click", () => {
    currentMonth.setMonth(currentMonth.getMonth() - 1);
    renderCalendar();
  });

  document.getElementById("next-month").addEventListener("click", () => {
    currentMonth.setMonth(currentMonth.getMonth() + 1);
    renderCalendar();
  });

  document.getElementById("clear-archives").addEventListener("click", () => {
    state.archives = [];
    saveAndRender();
  });
}

function addTaskFromForm() {
  const input = document.getElementById("task-input");
  const priority = document.getElementById("task-priority").value;
  const dueDate = document.getElementById("task-due").value;
  const text = input.value.trim();
  if (!text) return;

  addTask(text, priority, dueDate);
  input.value = "";
  document.getElementById("task-due").value = "";
  document.getElementById("task-priority").value = "medium";
}

function addTask(text, priority = "medium", dueDate = "") {
  state.tasks.unshift({
    id: createId(),
    text,
    priority,
    dueDate,
    completed: false,
    createdAt: new Date().toISOString()
  });
  saveAndRender();
}

function renderAll() {
  renderIntention();
  renderMainGoal();
  renderTasks();
  renderCalendar();
  renderDailyGoals();
  renderProgress();
  renderUpcoming();
  renderArchives();
}

function renderIntention() {
  const input = document.getElementById("monthly-intention");
  const display = document.getElementById("intention-display");
  input.value = state.intention;
  display.classList.toggle("empty", !state.intention);
  display.innerHTML = "";

  if (!state.intention) {
    display.textContent = "Aucune intention enregistree.";
    return;
  }

  const text = document.createElement("p");
  text.textContent = state.intention;
  const remove = createActionButton("Supprimer", "fa-trash", () => {
    state.intention = "";
    saveAndRender();
  });
  display.append(text, remove);
}

function renderMainGoal() {
  const display = document.getElementById("main-goal-display");
  display.classList.toggle("empty", !state.mainGoal);
  display.innerHTML = "";

  if (!state.mainGoal) {
    display.textContent = "Aucun objectif principal.";
    return;
  }

  const text = document.createElement("p");
  text.textContent = state.mainGoal;
  const remove = createActionButton("Retirer", "fa-xmark", () => {
    state.mainGoal = "";
    saveAndRender();
  });
  display.append(text, remove);
}

function renderTasks() {
  const list = document.getElementById("task-list");
  const filtered = getFilteredTasks();
  list.innerHTML = "";

  document.querySelectorAll("[data-filter]").forEach(button => {
    button.classList.toggle("active", button.dataset.filter === state.filter);
  });

  if (!filtered.length) {
    list.append(createEmptyItem("Aucune tache dans cette vue."));
    return;
  }

  filtered.forEach(task => {
    const item = document.createElement("li");
    item.className = `task-item priority-${task.priority || "medium"}`;
    item.classList.toggle("completed", task.completed);

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = task.completed;
    check.addEventListener("change", () => {
      task.completed = check.checked;
      if (task.completed && !task.completedAt) {
        task.completedAt = new Date().toISOString();
        state.archives.unshift({
          text: task.text,
          completedAt: task.completedAt
        });
      }
      if (!task.completed) {
        delete task.completedAt;
      }
      saveAndRender();
    });

    const content = document.createElement("div");
    content.className = "task-content";

    const title = document.createElement("span");
    title.textContent = task.text;

    const meta = document.createElement("small");
    meta.textContent = getTaskMeta(task);

    content.append(title, meta);

    const remove = createActionButton("Supprimer", "fa-trash", () => {
      state.tasks = state.tasks.filter(item => item.id !== task.id);
      saveAndRender();
    });

    item.append(check, content, remove);
    list.append(item);
  });
}

function getFilteredTasks() {
  const today = formatDate(new Date());
  const tasks = [...state.tasks].sort(sortTasks);

  if (state.filter === "active") {
    return tasks.filter(task => !task.completed);
  }
  if (state.filter === "done") {
    return tasks.filter(task => task.completed);
  }
  if (state.filter === "today") {
    return tasks.filter(task => task.dueDate === today);
  }
  return tasks;
}

function sortTasks(a, b) {
  const rank = { high: 0, medium: 1, low: 2 };
  if (a.completed !== b.completed) return a.completed ? 1 : -1;
  if ((a.dueDate || "") !== (b.dueDate || "")) return (a.dueDate || "9999").localeCompare(b.dueDate || "9999");
  return (rank[a.priority] ?? 1) - (rank[b.priority] ?? 1);
}

function renderCalendar() {
  const title = document.getElementById("calendar-title");
  const grid = document.getElementById("calendar-grid");
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const today = formatDate(new Date());
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  title.textContent = currentMonth.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  grid.innerHTML = "";

  for (let index = 0; index < firstDay; index += 1) {
    const spacer = document.createElement("span");
    spacer.className = "calendar-spacer";
    grid.append(spacer);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = formatDate(new Date(year, month, day));
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = day;
    button.className = "calendar-day";
    button.classList.toggle("today", date === today);
    button.classList.toggle("selected", date === selectedDate);
    button.classList.toggle("has-goal", Boolean(state.datedGoals[date]?.length || state.tasks.some(task => task.dueDate === date)));
    button.addEventListener("click", () => {
      selectedDate = date;
      renderCalendar();
      renderDailyGoals();
    });
    grid.append(button);
  }
}

function renderDailyGoals() {
  const label = document.getElementById("selected-date-label");
  const list = document.getElementById("daily-list");
  const goals = state.datedGoals[selectedDate] || [];

  label.textContent = new Date(`${selectedDate}T12:00:00`).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });

  list.innerHTML = "";
  if (!goals.length) {
    list.append(createEmptyItem("Aucun objectif pour cette date."));
    return;
  }

  goals.forEach(goal => {
    const item = document.createElement("li");
    item.className = "task-item compact-goal";
    item.classList.toggle("completed", goal.completed);

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = goal.completed;
    check.addEventListener("change", () => {
      goal.completed = check.checked;
      saveAndRender();
    });

    const content = document.createElement("div");
    content.className = "task-content";
    const span = document.createElement("span");
    span.textContent = goal.text;
    const meta = document.createElement("small");
    meta.textContent = "Objectif date";
    content.append(span, meta);

    const remove = createActionButton("Supprimer", "fa-trash", () => {
      state.datedGoals[selectedDate] = goals.filter(item => item.id !== goal.id);
      if (!state.datedGoals[selectedDate].length) {
        delete state.datedGoals[selectedDate];
      }
      saveAndRender();
    });

    item.append(check, content, remove);
    list.append(item);
  });
}

function renderProgress() {
  const total = state.tasks.length;
  const completed = state.tasks.filter(task => task.completed).length;
  const pending = total - completed;
  const dated = Object.values(state.datedGoals).reduce((sum, goals) => sum + goals.length, 0);
  const today = formatDate(new Date());
  const todayCount = state.tasks.filter(task => task.dueDate === today && !task.completed).length + (state.datedGoals[today]?.length || 0);
  const rate = total ? Math.round((completed / total) * 100) : 0;

  document.getElementById("summary-completed").textContent = completed;
  document.getElementById("summary-total").textContent = total;
  document.getElementById("summary-today").textContent = todayCount;
  document.getElementById("summary-rate").textContent = `${rate}%`;
  document.getElementById("completed-goals").textContent = completed;
  document.getElementById("pending-goals").textContent = pending;
  document.getElementById("dated-goals").textContent = dated;
  document.getElementById("progress-fill").style.width = `${rate}%`;
  document.getElementById("ring-rate").textContent = `${rate}%`;
  document.querySelector(".progress-ring").style.setProperty("--rate", `${rate}%`);
}

function renderUpcoming() {
  const list = document.getElementById("upcoming-list");
  const today = formatDate(new Date());
  const taskItems = state.tasks
    .filter(task => task.dueDate && task.dueDate >= today && !task.completed)
    .map(task => ({ text: task.text, date: task.dueDate, type: priorityLabels[task.priority] || "Tache" }));

  const datedItems = Object.entries(state.datedGoals)
    .filter(([date]) => date >= today)
    .flatMap(([date, goals]) => goals.filter(goal => !goal.completed).map(goal => ({ text: goal.text, date, type: "Calendrier" })));

  const upcoming = [...taskItems, ...datedItems].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 6);
  list.innerHTML = "";

  if (!upcoming.length) {
    list.append(createEmptyItem("Aucune echeance a venir."));
    return;
  }

  upcoming.forEach(entry => {
    const item = document.createElement("li");
    const text = document.createElement("span");
    const date = document.createElement("small");
    text.textContent = entry.text;
    date.textContent = `${formatDisplayDate(entry.date)} - ${entry.type}`;
    item.append(text, date);
    list.append(item);
  });
}

function renderArchives() {
  const list = document.getElementById("archive-list");
  list.innerHTML = "";

  if (!state.archives.length) {
    list.append(createEmptyItem("Les taches terminees apparaitront ici."));
    return;
  }

  state.archives.slice(0, 8).forEach(entry => {
    const item = document.createElement("li");
    const text = document.createElement("span");
    const date = document.createElement("small");
    text.textContent = entry.text;
    date.textContent = new Date(entry.completedAt).toLocaleDateString("fr-FR");
    item.append(text, date);
    list.append(item);
  });
}

function toggleDarkMode() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  saveState();
  applyTheme();
}

function applyTheme() {
  document.body.classList.toggle("dark-mode", state.theme === "dark");
  document.querySelector("#theme-toggle i").className = state.theme === "dark" ? "fas fa-sun" : "fas fa-moon";
}

function saveAndRender() {
  saveState();
  renderAll();
}

function loadState() {
  try {
    return { ...defaultState, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) };
  } catch {
    return { ...defaultState };
  }
}

function normalizeState(rawState) {
  const next = { ...defaultState, ...rawState };
  next.tasks = (next.tasks || []).map(task => ({
    id: task.id || createId(),
    text: task.text || String(task),
    priority: task.priority || "medium",
    dueDate: task.dueDate || "",
    completed: Boolean(task.completed),
    createdAt: task.createdAt || new Date().toISOString(),
    completedAt: task.completedAt
  }));
  next.datedGoals = next.datedGoals || {};
  next.archives = next.archives || [];
  return next;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short"
  });
}

function getTaskMeta(task) {
  const parts = [priorityLabels[task.priority] || "Normal"];
  if (task.dueDate) {
    parts.push(formatDisplayDate(task.dueDate));
  }
  return parts.join(" - ");
}

function createActionButton(label, icon, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "icon-button subtle";
  button.title = label;
  button.setAttribute("aria-label", label);
  button.innerHTML = `<i class="fas ${icon}"></i>`;
  button.addEventListener("click", onClick);
  return button;
}

function createEmptyItem(text) {
  const item = document.createElement("li");
  item.className = "empty-row";
  item.textContent = text;
  return item;
}

function createId() {
  if (window.crypto?.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
