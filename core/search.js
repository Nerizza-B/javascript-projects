// In-memory project filter: (category + search query)

let _all = [];
let _category = "all";
let _query = "";

// Initialize dataset
function init(projects) {
  _all = projects;
}

// Set active category filter
function setCategory(cat) {
  _category = cat;
}

// Set search query (normalized for matching)
function setQuery(q) {
  _query = q.toLowerCase().trim();
}

// Return filtered projects based on category and search query
function getFiltered() {
  return _all.filter((p) => {
    if (_category !== "all" && p.category !== _category) return false;
    if (!_query) return true;

    return (
      p.name.toLowerCase().includes(_query) ||
      p.description.toLowerCase().includes(_query) ||
      p.tags.some((t) => t.includes(_query))
    );
  });
}

export { init, setCategory, setQuery, getFiltered };
