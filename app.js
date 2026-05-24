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
const adminRoutes = require("./routes/patientRoutes");
const db = require("./sql/config");

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
        secure: false
    }
}));


// ROUTES
app.use("/", pageRoutes);
app.use("/auth", authRoutes);
app.use("/api", apiRoutes);
app.use("/api", patientRoutes);
app.use("/api", adminRoutes);




// 404
app.use((req, res) => {

    res.status(404).send(`
        <h1>404 - Server Offline</h1>
    `);

});

app.post('/patients', (req, res) => {
    const { naam, email } = req.body;

    if (!naam || !email) {
        return res.status(400).json({
            succes: false,
            message: 'Naam en email zijn verplicht'
        });
    }

    db.query(
        "INSERT INTO patients (naam, email) VALUES (?, ?)",
        [naam, email],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    succes: false,
                    message: 'Database error'
                });
            }

            res.json({
                succes: true,
                message: 'Patient ontvangen',
                id: results.insertId
            });
        }
    );
});

// START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {

    console.log(`Server running on http://localhost:${port}`);

});
