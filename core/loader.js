// Project loader: dynamically loads a project’s HTML, CSS, and JS into a stage container.

let _destroy = null;
let _styleLink = null;

async function loadProject(projectId, stageEl) {
  // Cleanup previous project (if any)
  if (typeof _destroy === "function") {
    _destroy();
    _destroy = null;
  }

  // Remove previously injected stylesheet
  if (_styleLink) {
    _styleLink.remove();
    _styleLink = null;
  }

  stageEl.innerHTML = `
    <div class="project-loader">
      <div class="project-loader__ring"></div>
      <span>Loading…</span>
    </div>`;

  const base = `/projects/${projectId}`;

  try {
    // Inject project CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `${base}/style.css?v=${Date.now()}`;
    document.head.appendChild(link);
    _styleLink = link;

    // Load HTML fragment
    const res = await fetch(`${base}/fragment.html`);
    if (!res.ok) throw new Error(`HTTP ${res.status} — ${base}/index.html`);
    stageEl.innerHTML = await res.text();

    // Load and initialize JS module
    const mod = await import(`${base}/script.js?v=${Date.now()}`);
    const root = stageEl.querySelector(".project-root");

    if (typeof mod.init === "function") mod.init(root ?? stageEl);

    // Store cleanup function for next load
    _destroy = mod.destroy ?? null;
  } catch (err) {
    stageEl.innerHTML = `
      <div class="load-error">
        <h2>Could not load project</h2>
        <p>${err.message}</p>
      </div>`;
    console.error("[loader]", err);
  }
}

export { loadProject };
