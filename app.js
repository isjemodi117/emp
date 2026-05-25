const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.static(path.join(__dirname, "public")));


/* READ FILE HELPER */
function load(filePath) {
    return fs.readFileSync(path.join(__dirname, filePath), "utf8");
}

/* TEMPLATE RENDER ENGINE */
function render(filePath) {
    let html = load(filePath);

    html = html.replaceAll("{{head}}", load("partials/head.html"));
    html = html.replaceAll("{{header}}", load("partials/header.html"));
    html = html.replaceAll("{{nav}}", load("partials/nav.html"));
    html = html.replaceAll("{{footer}}", load("partials/footer.html"));

    return html;
}

/* ROUTES */
app.get("/", (req, res) => {
    res.send(render("index.html"));
});

app.get("/about", (req, res) => {
    res.send(render("pages/about.html"));
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

app.get("/patient", (req, res) => {
    res.send(render("pages/patient_profile.html"));
});

app.get("/medication", (req, res) => {
    res.send(render("pages/medication.html"));
});

app.get("/history", (req, res) => {
    res.send(render("pages/patient_history.html"));
});

app.get("/new-visit", (req, res) => {
    res.send(render("new_visit.html"));
});

app.get("/admin", (req, res) => {
    res.send(render("pages/admin.html"));
});


/* START SERVER */
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});