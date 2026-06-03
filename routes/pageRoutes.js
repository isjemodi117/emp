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


function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();

    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();

    // If birthday hasn't happened yet this year, subtract 1
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
}



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

function allergie(id, callback){
    return db.promise().query(`
        SELECT a.name, ca.severity, ca.notes FROM client_allergies ca
        LEFT JOIN allergies a
        ON ca.allergy_id = a.id WHERE ca.client_id = ? `, 
    [id]).then(([rows]) => rows);
}

router.get("/patients/:id", requireAdmin, async (req, res) => {
    try {
        const patientId = req.params.id;

        const [results] = await db.promise().query(
            `SELECT * FROM clients WHERE id_kaart = ? LIMIT 1`,
            [patientId]
        );

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const patient = results[0];

        const allergies = await allergie(patient.id);

        let allergiesHtml = allergies.map(a => `
            <div class="quick-card emergency-alert">
                <span>Allergieën</span>
                <div class="alergy">
                    <strong>${a.name}</strong>
                    <p class="${(a.severity || "").toLowerCase()}">${a.severity}</p>
                    <p>Notes: ${a.notes}</p>
                </div>
            </div>
        `).join("");

        res.send(
            render("pages/patients.html", {
                css: `<link rel="stylesheet" href="../css/patients.css">`,
                user: currentUser(req),
                name: `${patient.first_name} ${patient.last_name}`,
                full_name: `${patient.first_name} ${patient.last_name}`,
                gender: patient.gender,
                blood_type: patient.blood_type,
                id_kaart: patient.id_kaart,
                szf_code: patient.szf_code,
                age: calculateAge(patient.birth_date),
                birth_date: new Date(patient.birth_date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                }),
                alergie: allergiesHtml,
                address: patient.address,
                phone: patient.phone,
                email: 'don@gmail.com',
                nationaliteit: 'Surinaams',
            })
        );

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


// HISTORY
router.get("/history/:id", requireAdmin, async (req, res) => {

    try {
        const patientId = req.params.id;

        const [results] = await db.promise().query(
            `SELECT * FROM clients WHERE id_kaart = ? LIMIT 1`,
            [patientId]
        );

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const patient = results[0];

        const allergies = await allergie(patient.id);

        let allergiesHtml = allergies.map(a => `
            <div class="profile-item">
                <span>Allergieën</span>
                <div class="alergy">
                    <strong>${a.name}</strong>
                    <p class="${(a.severity || "").toLowerCase()}">${a.severity}</p>
                    <p>Notes: ${a.notes}</p>
                </div>
            </div>
        `).join("");
        
        res.send(
            render("pages/history.html", {
                css: `<link rel="stylesheet" href="../css/history.css">`,
                user: currentUser(req),
                name: `${patient.first_name} ${patient.last_name}`,
                full_name: `${patient.first_name} ${patient.last_name}`,
                gender: patient.gender,
                blood_type: patient.blood_type,
                id_kaart: patient.id_kaart,
                szf_code: patient.szf_code,
                age: calculateAge(patient.birth_date),
                birth_date: calculateAge(patient.birth_date),
                alergie: allergiesHtml,
                address: patient.address,
                phone: patient.phone,
                email: '',
                nationaliteit: '',
            })
        );
    
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
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
router.get("/profile", requireLogin, (req, res) => {
    res.send(
        render("pages/profile.html", {
            css: `<link rel="stylesheet" href="css/profile.css">`,
            user: currentUser(req)
        })
    );
});

module.exports = router;