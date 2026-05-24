function currentUser(req) {
    if (!req.session || !req.session.user) {
        return {
            loggedIn: false,
            roles: [],
            permissions: []
        };
    }

    const user = req.session.user;

    return {
        loggedIn: true,
        id: user.id,
        email: user.email,
        roles: [user.role],
        permissions: user.permissions || []
    };
}

function redirectIfLoggedIn(req, res, next) {
    if (req.session && req.session.user) {
        return res.redirect("/"); // or "/"
    }

    next();
}

function requireLogin(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.status(401).redirect("/login");
    }

    next();
}

function requireAdmin(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.status(401).redirect("/login");
    }

    if (req.session.user.role !== "admin") {
        return res.status(403).send("Access denied");
    }

    next();
}

function requirePermission(permission) {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            return res.status(401).redirect("/login");
        }

        const permissions = req.session.user.permissions || [];

        if (!permissions.includes(permission)) {
            return res.status(403).send("No permission");
        }

        next();
    };
}

module.exports = {
    currentUser,
    requireLogin,
    requireAdmin,
    requirePermission,
    redirectIfLoggedIn
};