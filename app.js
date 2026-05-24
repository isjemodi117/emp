const express = require("express");
const path = require("path");
const fs = require("fs");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const session = require("express-session");
const dotenv = require("dotenv");

dotenv.config();

/* =========================
   DATABASE CONNECTIE
========================= */
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Paramaribo@9698", // verander als jouw wachtwoord anders is
    database: "medical_portal"      // verander als jouw database anders heet
});

db.connect((err) => {
    if (err) {
        console.error("Database fout:", err);
    } else {
        console.log("Verbonden met MySQL database.");
    }
});

/* =========================
   EXPRESS APP
========================= */
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
  secret: 'geheime_sleutel', // kies een sterke secret
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true, secure: false }
}));

/* =========================
   DUMMY USER
========================= */
const currentUser = {
    loggedIn: false,
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
                <span class="nav-username">Rajesh</span>
            </div>

            <div class="dropdown-menu">
                <a href="/profile">Mijn Profiel</a>
                <a href="/settings">Instellingen</a>
                <a href="/logout" class="logout-link">Logout</a>
            </div>
        </div>
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
   PROTECTED ROUTES
========================= */
function requireAdmin(req, res, next) {
    if (!currentUser.roles.includes("admin")) {
        return res.status(403).send("Access denied");
    }
    next();
}

/* =========================
   FRONTEND ROUTES
========================= */
app.get("/", (req, res) => {
    if (!currentUser.loggedIn) {
        return res.send(render("index.html"));
    }
    return res.send(render("pages/dashboard.html", {
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

app.get("/contact", (req, res) => {
    res.send(render("pages/contact.html"));
});

app.get("/terms", (req, res) => {
    res.send(render("pages/terms.html"));
});

app.get("/history", requireAdmin, (req, res) => {
    res.send(render("pages/history.html", {
        css: `<link rel="stylesheet" href="css/history.css">`
    }));
});

app.get("/dashboard", requireAdmin, (req, res) => {
    res.send(render("pages/dashboard.html"));
});

app.get("/patients", requireAdmin, (req, res) => {
    res.send(render("pages/patients.html", {
        css: `<link rel="stylesheet" href="css/patients.css">`
    }));
});

app.get("/scan", requireAdmin, (req, res) => {
    res.send(render("pages/scan.html", {
        css: `<link rel="stylesheet" href="css/scan.css">`
    }));
});

app.get("/visits", requireAdmin, (req, res) => {
    res.send(render("pages/visits.html", {
        css: `<link rel="stylesheet" href="css/visits.css">`
    }));
});

app.get("/profile", requireAdmin, (req, res) => {
    res.send(render("pages/profile.html", {
        css: `<link rel="stylesheet" href="css/profile.css">`
    }));
});

/* =========================
   API ROUTES (BACKEND)
========================= */

// Test database
app.get("/api/testdb", (req, res) => {
    db.query("SELECT 1 + 1 AS result", (err, results) => {
        if (err) return res.status(500).json({ error: "Database niet bereikbaar" });
        res.json({ message: "Database werkt!", result: results[0].result });
    });
});

// Haal alle patiënten op
app.get("/api/patients", (req, res) => {
    db.query("SELECT * FROM patients", (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// Tel aantal patiënten
app.get("/api/patient-count", (req, res) => {
    db.query("SELECT COUNT(*) AS total FROM patients", (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results[0]);
    });
});

// SIGNUP
app.post('/signup', (req, res) => {
  const { name, email, password, dob, phone } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Naam, email en wachtwoord zijn verplicht." });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const clientSql = `
    INSERT INTO clients (first_name, last_name, birth_date, phone, created_at)
    VALUES (?, ?, ?, ?, NOW())
  `;
  const [firstName, ...lastNameParts] = name.split(" ");
  const lastName = lastNameParts.join(" ");

  db.query(clientSql, [firstName, lastName, dob, phone], (err, clientResult) => {
    if(err) return res.status(500).json({error: err});
    const clientId = clientResult.insertId;

    const userSql = `
      INSERT INTO users (name, email, password_hash, role_id, client_id, created_at)
      VALUES (?, ?, ?, 1, ?, NOW())
    `;
    db.query(userSql, [name, email, hashedPassword, clientId], (err, userResult) => {
      if(err) return res.status(500).json({error: err});
      res.status(201).json({redirect: "/login", message: "Account succesvol aangemaakt!"});
    });
  });
});

// LOGIN
app.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email en wachtwoord zijn verplicht." });
  }

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], (err, results) => {
    if(err) return res.status(500).json({error: err});
    if(results.length === 0) return res.status(401).json({message: "Email niet gevonden"});

    const user = results[0];
    const match = bcrypt.compareSync(password, user.password_hash);
    if(!match) return res.status(401).json({message: "Wachtwoord onjuist"});

    req.session.userId = user.id;
    req.session.role = user.role_id;
    req.session.clientId = user.client_id;

    res.json({redirect: "/profile", message: "Login succesvol"});
  });
});

/* =========================
   START SERVER
========================= */
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
