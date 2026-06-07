// Client-side router: for switching between project pages without reload

let _callback = null;

// Extract project ID from current URL (/projects/:id)
function getProjectId() {
  const match = window.location.pathname.match(/^\/projects\/([^/]+)\/?$/);
  return match ? match[1] : null;
}

// Navigate programmatically and update browser URL
function navigate(projectId) {
  const url = projectId ? `/projects/${projectId}` : "/";
  history.pushState(null, "", url);

  if (_callback) {
    _callback(projectId);
  }
}

// Register route change handler (also handles back/forward navigation)
function onPathChange(callback) {
  _callback = callback;

  window.addEventListener("popstate", () => callback(getProjectId()));

  // Run once on init to sync with current URL
  callback(getProjectId());
}

export default {
  getProjectId,
  navigate,
  onPathChange,
};
