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
// HOME

router.get("/", (req, res) => {
    const user = currentUser(req);
    if (!user.loggedIn) {
        return res.send( render("index.html",{
        // css: `<link rel="stylesheet" href="css/profile.css">`,
        user: currentUser(req)
    }));
    }
    return res.send(
        render("pages/dashboard.html", {
            css: `<link rel="stylesheet" href="css/dashboard.css">`,
            user: currentUser(req)
        })
    );
});

// ABOUT
router.get("/about", (req, res) => {
    res.send(
        render("pages/about.html", {
            css: `<link rel="stylesheet" href="css/about.css">`,
            user: currentUser(req)
        })
    );
});

// SERVICES
router.get("/services", (req, res) => {
    res.send(
        render("pages/services.html", {
            css: `<link rel="stylesheet" href="css/services.css">`,
            user: currentUser(req)
        })
    );
});

// EMERGENCY
router.get("/emergency", (req, res) => {
    res.send(
        render("pages/emergency_contact.html", {
            css: `<link rel="stylesheet" href="css/emergency_contact.css">`,
            user: currentUser(req)
        })
    );
});

// LOGIN
router.get("/login", redirectIfLoggedIn, (req, res) => {
    res.send(
        render("pages/auth/login.html", {
            css: `<link rel="stylesheet" href="css/auth.css">`,
            user: currentUser(req)
        })
    );
});

// SIGNUP
router.get("/signup", (req, res) => {
    res.send(
        render("pages/auth/signup.html", {
            css: `<link rel="stylesheet" href="css/auth.css">`,
            user: currentUser(req)
        })
    );
});

// POLICY
router.get("/policy", (req, res) => {
    res.send(
        render("pages/policy.html", {
            // css: `<link rel="stylesheet" href="css/profile.css">`,
            user: currentUser(req)
        })
    );
});

// CONTACT
router.get("/contact", (req, res) => {
    res.send(
        render("pages/contact.html", {
            // css: `<link rel="stylesheet" href="css/profile.css">`,
            user: currentUser(req)
        })
    );
});

// TERMS
router.get("/terms", (req, res) => {
    res.send(
        render("pages/terms.html", {
            // css: `<link rel="stylesheet" href="css/profile.css">`,
            user: currentUser(req)
        })
    );
});

// DASHBOARD
router.get("/dashboard", requireAdmin, (req, res) => {
    res.send(
        render("pages/dashboard.html",{
        user: currentUser(req)
    }));
});

// PATIENTS
// router.get("/patients", requireAdmin, (req, res) => {
//     res.send(
//         render("pages/patients.html", {
//             css: `<link rel="stylesheet" href="css/patients.css">`,
//             user: currentUser(req)
//         })
//     );
// });

router.get("/patients/:id", requireAdmin, async (req, res) => {
    const patientId = req.params.id;
    const sql = `SELECT * FROM clients WHERE id_kaart = ? LIMIT 1`;
    db.query(sql, [patientId], (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const user = results[0];
        console.log(user);

        // SEND DATA TO HTML
        res.send(
            render("pages/patients.html", {
                css: `<link rel="stylesheet" href="../css/patients.css">`,
                user: currentUser(req),
                patient: user
            })
        );
    });
});
// HISTORY
router.get("/history", requireAdmin, (req, res) => {
    res.send(
        render("pages/history.html", {
            css: `<link rel="stylesheet" href="css/history.css">`,
            user: currentUser(req)
        })
    );
});

// SCAN
router.get("/scan", requireAdmin, (req, res) => {
    res.send(
        render("pages/scan.html", {
            css: `<link rel="stylesheet" href="css/scan.css">`,
            user: currentUser(req)
        })
    );
});

// VISITS
router.get("/visits", requireAdmin, (req, res) => {
    res.send(
        render("pages/visits.html", {
            css: `<link rel="stylesheet" href="css/visits.css">`,
            user: currentUser(req)
        })
    );
});

// PROFILE
router.get("/profile", requireAdmin, (req, res) => {
    res.send(
        render("pages/profile.html", {
            css: `<link rel="stylesheet" href="css/profile.css">`,
            user: currentUser(req)
        })
    );
});

module.exports = router;