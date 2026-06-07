// Main app shell: handles UI rendering, routing, search, theme, and navigation

import projects from "./projects.js";
import * as Search from "./core/search.js";
import Router from "./core/route.js";
import { loadProject } from "./core/loader.js";

// ── DOM references ────────────────────────────────────────────
const homeGrid = document.getElementById("home-grid");
const projectVP = document.getElementById("project-viewport");
const projectStage = document.getElementById("project-stage");
const projectTitle = document.getElementById("project-title");
const projectBadge = document.getElementById("project-category-badge");
const searchBox = document.getElementById("search-box");
const categoryBtns = document.querySelectorAll(".category-btn");
const backBtn = document.getElementById("back-btn");
const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebar-toggle");
const overlay = document.getElementById("overlay");
const projectCount = document.getElementById("project-count");
const overviewDesc = document.getElementById("overview-desc");
const overviewTags = document.getElementById("overview-tags");
const overviewDate = document.getElementById("overview-date");
const themeToggle = document.getElementById("theme-toggle");

// Initialize search with project dataset
Search.init(projects);

// ── Theme handling ────────────────────────────────────────────
const savedTheme = localStorage.getItem("theme") ?? "dark";
document.documentElement.setAttribute("data-theme", savedTheme);
updateThemeIcon(savedTheme);

// Update theme toggle icon based on current theme
function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector("i");
  icon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
}

// Toggle between light and dark themes
themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  updateThemeIcon(next);
});

// ── Home grid rendering ───────────────────────────────────────
function renderGrid() {
  const list = Search.getFiltered();

  projectCount.textContent = `${list.length} project${list.length !== 1 ? "s" : ""}`;

  if (!list.length) {
    homeGrid.innerHTML =
      '<p class="shell-empty">No projects match your search.</p>';
    return;
  }

  homeGrid.innerHTML = list
    .map(
      (p) => `
    <article class="shell-card"
             data-id="${p.id}"
             role="button"
             tabindex="0"
             aria-label="Open ${p.name}">
      <div class="shell-card-icon shell-cat-${p.category}">
        <i class="${p.icon ?? "fa-solid fa-star"}"></i>
      </div>
      <h2 class="shell-card-title">${p.name}</h2>
      <p class="shell-card-desc">${p.description}</p>
      <span class="shell-card-badge shell-badge-${p.category}">
        ${p.category}
      </span>
    </article>
  `,
    )
    .join("");
}

// ── Grid interactions (open project) ──────────────────────────
homeGrid.addEventListener("click", (e) => {
  const card = e.target.closest("[data-id]");
  if (card) Router.navigate(card.dataset.id);
});

homeGrid.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    const card = e.target.closest("[data-id]");
    if (card) {
      e.preventDefault();
      Router.navigate(card.dataset.id);
    }
  }
});

// ── Search & filtering ────────────────────────────────────────
let _lastQuery = "";

function handleSearch() {
  const q = searchBox.value;
  if (q === _lastQuery) return;

  _lastQuery = q;
  Search.setQuery(q);
  renderGrid();
}

searchBox.addEventListener("input", handleSearch);
searchBox.addEventListener("keyup", handleSearch);

// Category filtering
categoryBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    categoryBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    Search.setCategory(btn.dataset.category);

    // If inside a project view, return home; otherwise just re-render
    if (!projectVP.hidden) {
      Router.navigate(null);
    } else {
      renderGrid();
    }
  });
});

// ── Navigation controls ────────────────────────────────────────
backBtn.addEventListener("click", () => Router.navigate(null));

// ── Sidebar behavior (mobile + desktop) ───────────────────────
const isMobile = () => window.innerWidth <= 768;

// Close sidebar depending on screen mode
function closeSidebar() {
  if (isMobile()) {
    sidebar.classList.remove("open");
    overlay.hidden = true;
  } else {
    document.body.classList.add("sidebar-collapsed");
    localStorage.setItem("sidebar", "closed");
  }

  sidebarToggle.setAttribute("aria-expanded", "false");
}

// Toggle sidebar state
sidebarToggle.addEventListener("click", () => {
  if (isMobile()) {
    const isOpen = sidebar.classList.toggle("open");
    overlay.hidden = !isOpen;
    sidebarToggle.setAttribute("aria-expanded", String(isOpen));
  } else {
    const isCollapsed = document.body.classList.toggle("sidebar-collapsed");
    sidebarToggle.setAttribute("aria-expanded", String(!isCollapsed));
    localStorage.setItem("sidebar", isCollapsed ? "closed" : "open");
  }
});

overlay.addEventListener("click", closeSidebar);

// Close sidebar when selecting category (mobile UX)
sidebar.addEventListener("click", (e) => {
  if (isMobile() && e.target.closest(".category-btn")) closeSidebar();
});

// Restore desktop sidebar state
if (!isMobile() && localStorage.getItem("sidebar") === "closed") {
  document.body.classList.add("sidebar-collapsed");
  sidebarToggle.setAttribute("aria-expanded", "false");
}

// ── Routing ───────────────────────────────────────────────────
Router.onPathChange(async (projectId) => {
  // Home view
  if (!projectId) {
    projectVP.hidden = true;
    homeGrid.hidden = false;
    document.title = "JavascriptProjects";
    renderGrid();
    return;
  }

  // Project view
  const meta = projects.find((p) => p.id === projectId);

  homeGrid.hidden = true;
  projectVP.hidden = false;

  projectTitle.textContent = meta?.name ?? projectId;
  document.title = `${meta?.name ?? projectId} — JavascriptProjects`;

  const cat = meta?.category ?? "";
  projectBadge.textContent = cat;
  projectBadge.className = `shell-badge-${cat}`;

  overviewDesc.textContent = meta?.description ?? "";
  overviewTags.innerHTML = (meta?.tags ?? [])
    .map((t) => `<span class="overview-tag">${t}</span>`)
    .join("");

  overviewDate.textContent = meta?.added ? `Added ${meta.added}` : "";

  await loadProject(projectId, projectStage);
});
