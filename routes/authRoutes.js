const express = require("express"); 
const router = express.Router();
const db = require("../sql/config");
// router.post("/login", (req, res) => {
//   const { email, password } = req.body; const sql = `        
//           SELECT
//             users.id,
//             users.email,
//             users.password,
//             users.role,            
//             clients.id AS client_id,
//             clients.szf_code,
//             clients.first_name,
//             clients.last_name,
//             clients.gender,
//             clients.birth_date        
//           FROM users        
//           INNER JOIN clients
//         ON users.client_id = clients.id        
//         WHERE users.email = ?    
//       `; db.query(sql, [email], (err, results) => {
//     if (err) {
//       console.log(err); return res.status(500).json({
//         success: false,
//         message: "Database error"
//       });
//     } if (results.length === 0) {
//       return res.status(401).json({
//         success: false,
//         message: "Email not found"
//       });
//     } const user = results[0];    // CHECK PASSWORD
//     if (password !== user.password) {
//       return res.status(401).json({
//         success: false,
//         message: "Wrong password"
//       });
//     }    // SAVE SESSION
//     req.session.user = { id: user.id, client_id: user.client_id, email: user.email, role: user.role, szf_code: user.szf_code, first_name: user.first_name, last_name: user.last_name }; res.json({ success: true, message: "Login successful", user: req.session.user });
//   });
// });// LOGOUT
// router.get("/logout", (req, res) => { req.session.destroy(() => { res.redirect("/login"); }); }); module.exports = router;

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = `
        SELECT users.id, users.email, users.password, users.role
        FROM users
        WHERE users.email = ?
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

        // ✅ SESSION STORE
        req.session.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            permissions: ["dashboard", "patients", "visits"]
        };

        return res.json({
            success: true,
            message: "Login successful",
            user: req.session.user
        });
    });
});

module.exports = router; // ✅ MUST be this

