// Express server for serving a client-side SPA with static project loading

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Configure EJS (reserved for future server-rendered pages)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static file serving for core app modules and projects
app.use("/core", express.static(path.join(__dirname, "core")));
app.use("/projects", express.static(path.join(__dirname, "projects")));

// Serve root-level static assets (CSS, JS, etc.)
app.use(express.static(__dirname, { index: false }));

// Example SSR route placeholder (optional expansion)
// app.get('/about', (req, res) => res.render('about'));

// SPA fallback: always serve index.html for client-side routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`JS Projects running at http://localhost:${PORT}`);
});
