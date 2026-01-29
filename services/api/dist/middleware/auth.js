"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireTwoFactorAuth = exports.requireEmailVerification = exports.optionalAuthMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
const logger_1 = require("../config/logger");
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Access token required',
                },
            });
            return;
        }
        const token = authHeader.substring(7);
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            logger_1.logger.error('JWT_SECRET is not configured');
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Server configuration error',
                },
            });
            return;
        }
        // Verify JWT token
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        // Fetch user from database
        const user = await database_1.prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                emailVerified: true,
                twoFactorEnabled: true,
            },
        });
        if (!user) {
            res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Invalid token - user not found',
                },
            });
            return;
        }
        // Attach user to request
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({
                success: false,
                error: {
                    code: 'TOKEN_EXPIRED',
                    message: 'Access token has expired',
                },
            });
            return;
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({
                success: false,
                error: {
                    code: 'INVALID_TOKEN',
                    message: 'Invalid access token',
                },
            });
            return;
        }
        logger_1.logger.error('Authentication error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'Authentication failed',
            },
        });
    }
};
exports.authMiddleware = authMiddleware;
const optionalAuthMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            next();
            return;
        }
        const token = authHeader.substring(7);
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            next();
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        const user = await database_1.prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                emailVerified: true,
                twoFactorEnabled: true,
            },
        });
        if (user) {
            req.user = user;
        }
        next();
    }
    catch (error) {
        // Silently fail for optional auth
        next();
    }
};
exports.optionalAuthMiddleware = optionalAuthMiddleware;
const requireEmailVerification = (req, res, next) => {
    if (!req.user?.emailVerified) {
        res.status(403).json({
            success: false,
            error: {
                code: 'EMAIL_NOT_VERIFIED',
                message: 'Email verification required',
            },
        });
        return;
    }
    next();
};
exports.requireEmailVerification = requireEmailVerification;
const requireTwoFactorAuth = (req, res, next) => {
    if (!req.user?.twoFactorEnabled) {
        res.status(403).json({
            success: false,
            error: {
                code: 'TWO_FACTOR_REQUIRED',
                message: 'Two-factor authentication required',
            },
        });
        return;
    }
    next();
};
exports.requireTwoFactorAuth = requireTwoFactorAuth;
