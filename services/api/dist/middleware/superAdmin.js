"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSuperAdmin = void 0;
const parseCsv = (value) => {
    if (!value)
        return [];
    return value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
};
const requireSuperAdmin = (req, res, next) => {
    const userEmail = req.user?.email;
    if (!userEmail) {
        res.status(401).json({
            success: false,
            error: {
                code: 'UNAUTHORIZED',
                message: 'Authentication required',
            },
        });
        return;
    }
    const allowedEmails = parseCsv(process.env.SUPER_ADMIN_EMAILS);
    if (!allowedEmails.includes(userEmail)) {
        res.status(403).json({
            success: false,
            error: {
                code: 'FORBIDDEN',
                message: 'Super admin access required',
            },
        });
        return;
    }
    next();
};
exports.requireSuperAdmin = requireSuperAdmin;
