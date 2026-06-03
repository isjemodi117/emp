const express = require("express");
const router = express.Router();
const { redirectIfLoggedIn } = require("../middlewares/authMiddleware");
const db = require("../config/db");

const render = require("../utils/render");
const {
    requireAdmin,
    requireLogin,
    requirePermission,
    verifyToken,
    currentUser
} = require("../middlewares/authMiddleware");

router.get("/new_patient", requireAdmin, (req, res) => {
    res.send(
        render("pages/new_patient.html", {
            css: `<link rel="stylesheet" href="/css/new-patient.css">`,
            user: currentUser(req)
        })
    );
});

router.get("/new_visits", requireAdmin, (req, res) => {
    res.send(
        render("pages/new_visit.html", {
            css: `<link rel="stylesheet" href="/css/new_visit.css">`,
            user: currentUser(req)
        })
    );
});

router.get("/emergency", requireAdmin, (req, res) => {
    res.send(
        render("pages/emergency.html", {
            css: `<link rel="stylesheet" href="/css/emergency.css">`,
            user: currentUser(req)
        })
    );
});

module.exports = router;