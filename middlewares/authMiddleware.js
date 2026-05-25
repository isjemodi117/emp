const jwt = require('jsonwebtoken');


const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];

    if (!bearerHeader) {
        return res.status(403).json({
            message: 'Access denied. No token provided.'
        });
    }

    const token = bearerHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid token'
        });
    }
};

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
    redirectIfLoggedIn,
    verifyToken
};