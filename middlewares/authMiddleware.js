const currentUser = {
    loggedIn: false,
    roles: ["admin", "doctor"],
    permissions: ["dashboard", "patients", "visits"]
};

function requireAdmin(req, res, next) {

    if (!currentUser.roles.includes("admin")) {

        return res.status(403).send("Access denied");

    }

    next();

}

module.exports = {
    requireAdmin,
    currentUser
};