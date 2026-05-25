require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");

const app = express();

// ROUTES
const apiRoutes = require("./routes/apiRoutes");
const pageRoutes = require("./routes/pageRoutes");
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
    secret: "geheime_sleutel",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60  // 1 HOUR
    }
}));


// ROUTES
app.use("/", pageRoutes);
app.use("/auth", authRoutes);
app.use("/api", apiRoutes);

app.get("/api/client/:szf_number", (req, res) => {
  const szf_number = req.params.szf_number;
  const sql = "SELECT id, name FROM clients WHERE szf_number = ?";
  db.query(sql, [szf_number], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ error: "Client not found" });
    }
  });
});

// 404
app.use((req, res) => {

    res.status(404).send(`
        <h1>404 - Server Offline</h1>
    `);

});

// START SERVER
app.listen(3000, () => {

    console.log("Server running on http://localhost:3000");

});
