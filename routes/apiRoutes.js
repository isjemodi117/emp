const express = require("express");

const router = express.Router();

const db = require("../config/db");

// TEST DB
router.get("/testdb", (req, res) => {

    db.query(
        "SELECT 1 + 1 AS result",
        (err, results) => {

            if (err) {

                return res.status(500).json({
                    error: "Database niet bereikbaar"
                });

            }

            res.json({
                message: "Database werkt!",
                result: results[0].result
            });

        }
    );

});

// GET PATIENT
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

    db.query(
        "SELECT * FROM patients",
        (err, results) => {

            if (err) {

                return res.status(500).json({
                    error: err
                });

            }

            res.json(results);

        }
    );

});

// PATIENT COUNT
router.get("/patient-count", (req, res) => {

    db.query(
        "SELECT COUNT(*) AS total FROM patients",
        (err, results) => {

            if (err) {

                return res.status(500).json({
                    error: err
                });

            }

            res.json(results[0]);

        }
    );

});
// GET CLIENT BY SZF CODE
router.get("/client/:szf_code", (req, res) => {
  const szf_code = req.params.szf_code;
  const sql = "SELECT id, first_name, last_name FROM clients WHERE szf_code = ?";
  db.query(sql, [szf_code], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) {
      res.json({
        success: true,
        id: results[0].id,
        name: results[0].first_name + ' ' + results[0].last_name
      });
    } else {
      res.status(404).json({ success: false, error: "Client not found" });
    }
  });
});

module.exports = router;