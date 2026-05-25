const fs = require("fs");
const path = require("path");
const { currentUser } = require("../middlewares/authMiddleware");

function load(filePath) {
    return fs.readFileSync(
        path.join(__dirname, "..", filePath),
        "utf8"
    );
}
function generateNavbar(user = { loggedIn: false, permissions: [] }) {
    console.log("==== NAVBAR DEBUG ====");
    console.log("LoggedIn:", user.loggedIn);
    console.log("Roles:", user.roles);
    console.log("Permissions:", user.permissions);
    console.log("======================");

    if (!user.loggedIn) {
        return load("partials/header.html") + load("partials/nav.html");
    }

    let nav = `
    <header class="navbar">

        <div class="logo">
            <a href="/"><img src="/img/logo.png" class="logo-img"></a>
            EMP
        </div>

        <nav>
            <a href="/scan">Scan</a>
            <a href="/visits">Visits</a>
    `;

    if (user.permissions.includes("dashboard")) {
        nav += `<a href="/patients">Patiënten</a>`;
    }

    if (user.permissions.includes("doctors")) {
        nav += `<a href="/doctors">Doctors</a>`;
    }

    nav += `
        <div class="user-dropdown">

            <div class="user-trigger">
                <img src="/img/user.png" class="nav-user-img">
                <span class="nav-username">${user.email}</span>
            </div>

            <div class="dropdown-menu">
                <a href="/profile">Mijn Profiel</a>
                <a href="/settings">Instellingen</a>
                <a href="/auth/logout">Logout</a>
            </div>

        </div>

        </nav>

    </header>
    `;

    return nav;
}

function render(filePath, options = {}) {

    let html = load(filePath);
    let head = load("partials/head.html");

    head = head.replaceAll("{{title}}", options.title || "EMP");
    head = head.replaceAll("{{css}}", options.css || "");

    html = html.replaceAll("{{head}}", head);

    html = html.replaceAll(
        "{{header}}",
        generateNavbar(options.user)
    );

    html = html.replaceAll(
        "{{footer}}",
        load("partials/footer.html")
    );

    html = html.replaceAll(
        "{{nav}}",
        load("partials/nav.html")
    );

    return html;
}

module.exports = render;