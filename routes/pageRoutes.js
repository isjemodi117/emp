const express = require("express");

const router = express.Router();

const render = require("../utils/render");

const {
    requireAdmin,
    currentUser
} = require("../middlewares/authMiddleware");

// HOME
router.get("/", (req, res) => {

    if (!currentUser.loggedIn) {
        return res.send( render("index.html",{
        css: `<link rel="stylesheet" href="css/profile.css">`
    }));

    }

    return res.send(

        render("pages/dashboard.html", {

            css: `
                <link rel="stylesheet"
                      href="css/profile.css">
            `

        })

    );

});

// ABOUT
router.get("/about", (req, res) => {

    res.send(

        render("pages/about.html", {

            css: `
                <link rel="stylesheet"
                      href="/css/about.css">
            `

        })

    );

});

// SERVICES
router.get("/services", (req, res) => {

    res.send(
        render("pages/services.html")
    );

});

// EMERGENCY
router.get("/emergency", (req, res) => {

    res.send(
        render("pages/emergency_contact.html")
    );

});

// LOGIN
router.get("/login", (req, res) => {

    res.send(
        render("pages/auth/login.html")
    );

});

// SIGNUP
router.get("/signup", (req, res) => {

    res.send(
        render("pages/auth/signup.html")
    );

});

// POLICY
router.get("/policy", (req, res) => {

    res.send(
        render("pages/policy.html")
    );

});

// CONTACT
router.get("/contact", (req, res) => {

    res.send(
        render("pages/contact.html")
    );

});

// TERMS
router.get("/terms", (req, res) => {

    res.send(
        render("pages/terms.html")
    );

});

// HISTORY
router.get("/history", requireAdmin, (req, res) => {

    res.send(

        render("pages/history.html", {

            css: `
                <link rel="stylesheet"
                      href="css/history.css">
            `

        })

    );

});

// DASHBOARD
router.get("/dashboard", requireAdmin, (req, res) => {

    res.send(
        render("pages/dashboard.html")
    );

});

// PATIENTS
router.get("/patients", requireAdmin, (req, res) => {

    res.send(

        render("pages/patients.html", {

            css: `
                <link rel="stylesheet"
                      href="css/patients.css">
            `

        })

    );

});

// SCAN
router.get("/scan", requireAdmin, (req, res) => {

    res.send(

        render("pages/scan.html", {

            css: `
                <link rel="stylesheet"
                      href="css/scan.css">
            `

        })

    );

});

// VISITS
router.get("/visits", requireAdmin, (req, res) => {

    res.send(

        render("pages/visits.html", {

            css: `
                <link rel="stylesheet"
                      href="css/visits.css">
            `

        })

    );

});

// PROFILE
router.get("/profile", requireAdmin, (req, res) => {

    res.send(

        render("pages/profile.html", {

            css: `
                <link rel="stylesheet"
                      href="css/profile.css">
            `

        })

    );

});

module.exports = router;