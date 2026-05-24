const express = require("express");
const router = express.Router();
const db = require("../sql/config");

// GET PATIENT BY ID
router.get("/patient/:id", (req, res) => {

    const idNumber = req.params.id;

    const sql =
        "SELECT * FROM patients WHERE id_number = ?";

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

// GET ALL PATIENTS
router.get("/patients", (req, res) => {

    db.query("SELECT * FROM patients", (err, results) => {

        if (err) {
            return res.status(500).json({ error: err });
        }

        res.json(results);

    });

});

// PATIENT COUNT
router.get("/patient-count", (req, res) => {

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

module.exports = router;