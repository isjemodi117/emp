const express = require("express");
const router = express.Router();
const db = require("../sql/config");

// 🔐 Session-based admin beveiliging
const { requireAdmin } = require("../middleware/authmiddelware");


// =========================
// GET PATIENT BY ID
// =========================
router.get("/patient/:id", requireAdmin, (req, res) => {

    const idNumber = req.params.id;

    const sql = "SELECT * FROM patients WHERE id_number = ?";

    db.query(sql, [idNumber], (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        res.json({
            success: true,
            patient: results[0]
        });

    });

});


// =========================
// GET ALL PATIENTS
// =========================
router.get("/patients", requireAdmin, (req, res) => {

    db.query("SELECT * FROM patients", (err, results) => {

        if (err) {
            return res.status(500).json({ error: err });
        }

        res.json(results);

    });

});


// =========================
// PATIENT COUNT
// =========================
router.get("/patient-count", requireAdmin, (req, res) => {

    db.query(
        "SELECT COUNT(*) AS total FROM patients",
        (err, results) => {

            if (err) {
                return res.status(500).json({ error: err });
            }

            res.json(results[0]);

        }
    );

});


// =========================
// ADD NEW PATIENT (CREATE)
// =========================
router.post("/patients", requireAdmin, (req, res) => {

    const { id_number, name, birthdate, bloodtype } = req.body;

    const sql = `
        INSERT INTO patients (id_number, name, birthdate, bloodtype)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [id_number, name, birthdate, bloodtype], (err) => {

        if (err) {
            return res.status(500).json({
                success: false,
                error: err
            });
        }

        res.json({
            success: true,
            message: "Patiënt toegevoegd"
        });

    });

});


// =========================
// UPDATE PATIENT (UPDATE)
// =========================
router.put("/patient/:id", requireAdmin, (req, res) => {

    const { name, birthdate, bloodtype } = req.body;

    const sql = `
        UPDATE patients
        SET name = ?, birthdate = ?, bloodtype = ?
        WHERE id_number = ?
    `;

    db.query(sql, [name, birthdate, bloodtype, req.params.id], (err) => {

        if (err) {
            return res.status(500).json({
                success: false,
                error: err
            });
        }

        res.json({
            success: true,
            message: "Patiënt bijgewerkt"
        });

    });

});


// =========================
// DELETE PATIENT (DELETE)
// =========================
router.delete("/patient/:id", requireAdmin, (req, res) => {

    const sql = "DELETE FROM patients WHERE id_number = ?";

    db.query(sql, [req.params.id], (err) => {

        if (err) {
            return res.status(500).json({
                success: false,
                error: err
            });
        }

        res.json({
            success: true,
            message: "Patiënt verwijderd"
        });

    });

});


module.exports = router;
