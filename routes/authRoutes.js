const express = require("express");
const router = express.Router();
const db = require("../sql/config");

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

router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

module.exports = router;