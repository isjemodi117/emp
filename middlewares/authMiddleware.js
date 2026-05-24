function requireLogin(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Not logged in"
        });
    }

    next();
}

function requireAdmin(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Not logged in"
        });
    }

    if (req.session.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Access denied (admin only)"
        });
    }

    next();
}

function requirePermission(permission) {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            return res.status(401).json({
                success: false,
                message: "Not logged in"
            });
        }

        const permissions = req.session.user.permissions || [];

        if (!permissions.includes(permission)) {
            return res.status(403).json({
                success: false,
                message: "No permission"
            });
        }

        next();
    };
}

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
        roles: [user.role], // convert role → array for compatibility
        permissions: user.permissions || [],
        id: user.id,
        email: user.email
    };
}

module.exports = {
    requireLogin,
    requireAdmin,
    requirePermission,
    currentUser
};