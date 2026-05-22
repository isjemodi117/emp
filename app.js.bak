const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

/* =========================
   DUMMY USER
========================= */
const currentUser = {
    loggedIn: true,
    roles: ["admin", "doctor"],
    permissions: ["dashboard", "patients", "visits"]
};

/* =========================
   LOAD FILE
========================= */
function load(filePath) {
    return fs.readFileSync(path.join(__dirname, filePath), "utf8");
}

/* =========================
   NAVBAR
========================= */
function generateNavbar(user) {
    if (!user.loggedIn) {
        return load("partials/header.html") + load("partials/nav.html");
    }
    let nav = `
    <header class="navbar">

        <div class="logo">
            <a href="/">
                <img src="/img/logo.png" class="logo-img">
            </a>
            EMP
        </div>

        <nav>
        
            <a href="scan">Scan</a>
            <a href="visits">Visits</a>
    `;
    
       // ROLE BASED LINKS
    if (user.permissions.includes("dashboard")) {
        nav += `<a href="/patients">Patiënten</a>`;
    }
    if (user.permissions.includes("doctors")) {
        nav += `<a href="/patients">Doctors</a>`;
    }

    nav += `
    <div class="user-dropdown">

    <div class="user-trigger">

        <img src="/img/user.jpg" alt="User" class="nav-user-img">

        <span class="nav-username">
            Rajesh
        </span>

    </div>

    <div class="dropdown-menu">

        <a href="/profile">
            Mijn Profiel
        </a>

        <a href="/settings">
            Instellingen
        </a>

        <a href="/logout" class="logout-link">
            Logout
        </a>

    </div>

</div>`;

    nav += `
        </nav>
    </header>
    `;

    return nav;
}






/* =========================
   RENDER ENGINE
========================= */
function render(filePath, options = {}) {

    let html = load(filePath);

    let head = load("partials/head.html");

    head = head.replaceAll("{{title}}", options.title || "EMP");
    head = head.replaceAll("{{css}}", options.css || "");

    html = html.replaceAll("{{head}}", head);
    html = html.replaceAll("{{header}}", generateNavbar(currentUser));
    html = html.replaceAll("{{footer}}", load("partials/footer.html"));
    html = html.replaceAll("{{nav}}", load("partials/nav.html"));

    return html;
}







/* =========================
   ROUTES
========================= */
app.get("/", (req, res) => {
    if (!currentUser.loggedIn) {
        return res.send(render("index.html"));
    }
    return res.send(render("pages/dashboard.html",{
        css: `<link rel="stylesheet" href="css/profile.css">`
    }));

});

app.get("/about", (req, res) => {
    res.send(render("pages/about.html", {
        css: `<link rel="stylesheet" href="/css/about.css">`
    }));
});

app.get("/services", (req, res) => {
    res.send(render("pages/services.html"));
});

app.get("/emergency", (req, res) => {
    res.send(render("pages/emergency_contact.html"));
});

app.get("/login", (req, res) => {
    res.send(render("pages/auth/login.html"));
});

app.get("/signup", (req, res) => {
    res.send(render("pages/auth/signup.html"));
});

app.get("/policy", (req, res) => {
    res.send(render("pages/policy.html"));
});


app.get("/history", requireAdmin, (req, res) => {
    res.send(render("pages/history.html",{
        css: `<link rel="stylesheet" href="css/history.css">`
    }));
});





/* 🔥 FIXED PROTECTED ROUTES */
function requireAdmin(req, res, next) {
    if (!currentUser.roles.includes("admin")) {
        return res.status(403).send("Access denied");
    }
    next();
}

app.get("/dashboard", requireAdmin, (req, res) => {
    res.send(render("pages/dashboard.html"));
});

app.get("/patients", requireAdmin, (req, res) => {
    res.send(render("pages/patients.html",{
        css: `<link rel="stylesheet" href="css/patients.css">`
    }));
});

app.get("/scan", requireAdmin, (req, res) => {
    res.send(render("pages/scan.html",{
        css: `<link rel="stylesheet" href="css/scan.css">`
    }));
});

app.get("/visits", requireAdmin, (req, res) => {
    res.send(render("pages/visits.html",{
        css: `<link rel="stylesheet" href="css/visits.css">`
    }));
});

app.get("/profile", requireAdmin, (req, res) => {
    res.send(render("pages/profile.html",{
        css: `<link rel="stylesheet" href="css/profile.css">`
    }));
});


/* =========================
   START SERVER
========================= */
app.listen(3000, "0.0.0.0", () => {
    console.log("Server running on http://localhost:3000");
});