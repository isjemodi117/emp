const express = require("express");
const router = express.Router();
const db = require("../config/db");

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


router.post("/login", (req, res) => {

    const { email, password } = req.body;

    const sql = `
        SELECT id, email, password, role
        FROM users
        WHERE email = ?
        LIMIT 1
    `;

    db.query(sql, [email], (err, results) => {

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

        if (password !== user.password) {
            return res.status(401).json({
                success: false,
                message: "Wrong password"
            });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // SAVE SESSION
        req.session.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            permissions: ["dashboard", "patients", "visits"]
        };

        res.json({
            success: true,
            message: "Login successful",
            user: req.session.user
        });
    });
});

router.post("/signup", (req, res) => {

    const { name, email, password, dob, phone, gender } = req.body;

    const nameParts = name.trim().split(" ");
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(" ") || "-";
    const szf_code = "SZF-" + Date.now().toString().slice(-8);

    const sqlClient = `
        INSERT INTO clients (szf_code, first_name, last_name, gender, birth_date, phone)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sqlClient, [szf_code, first_name, last_name, gender || "Onbekend", dob, phone || null], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        const client_id = result.insertId;

        const sqlUser = "INSERT INTO users (client_id, email, password, role) VALUES (?, ?, ?, 'client')";

        db.query(sqlUser, [client_id, email, password], (err, userResult) => {
            if (err) return res.status(500).json({ success: false, message: err.message });

            req.session.user = {
                id: userResult.insertId,
                email,
                role: "client",
                permissions: ["profile"]
            };

            res.json({ success: true });
        });
    });

});

router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

module.exports = router;