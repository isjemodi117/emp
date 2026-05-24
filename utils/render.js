const fs = require("fs");
const path = require("path");

const { requireLogin, currentUser } = require("../middlewares/authMiddleware");

function load(filePath) {

    return fs.readFileSync(
        path.join(__dirname, "..", filePath),
        "utf8"
    );

}

function generateNavbar(user = {}) {

    const permissions = user.permissions || [];
    const roles = user.roles || [];

    if (!user.loggedIn) {
        return `
        <header class="navbar">
            <div class="logo">
                <a href="/"><img src="/img/logo.png" class="logo-img"></a>
                EMP
            </div>
            <nav>
                <a href="/login">Login</a>
            </nav>
        </header>
        `;
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

    if (permissions.includes("dashboard")) {
        nav += `<a href="/patients">Patiënten</a>`;
    }

    if (permissions.includes("doctors")) {
        nav += `<a href="/doctors">Doctors</a>`;
    }

    nav += `
        <div class="user-dropdown">
            <div class="user-trigger">
                <img src="/img/user.jpg" class="nav-user-img">
                <span class="nav-username">
                    ${user.email || "User"}
                </span>
            </div>

            <div class="dropdown-menu">
                <a href="/profile">Mijn Profiel</a>
                <a href="/settings">Instellingen</a>
                <a href="/logout">Logout</a>
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

    head = head.replaceAll(
        "{{title}}",
        options.title || "EMP"
    );

    head = head.replaceAll(
        "{{css}}",
        options.css || ""
    );

    html = html.replaceAll("{{head}}", head);

    html = html.replaceAll(
        "{{header}}",
        generateNavbar(currentUser)
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