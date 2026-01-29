"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const database_1 = require("../config/database");
const logger_1 = require("../config/logger");
const errorHandler_1 = require("../middleware/errorHandler");
const redis_1 = require("../config/redis");
const router = (0, express_1.Router)();
// Validation middleware
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Validation failed',
                details: errors.array(),
            },
        });
    }
    next();
};
// Register with email
router.post('/register', [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
    (0, express_validator_1.body)('firstName').trim().isLength({ min: 1, max: 50 }),
    (0, express_validator_1.body)('lastName').trim().isLength({ min: 1, max: 50 }),
], handleValidationErrors, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    // Check if user already exists
    const existingUser = await database_1.prisma.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        throw (0, errorHandler_1.createError)('User already exists', 409, 'USER_EXISTS');
    }
    // Hash password
    const passwordHash = await bcryptjs_1.default.hash(password, 12);
    // Create user
    const user = await database_1.prisma.user.create({
        data: {
            email,
            firstName,
            lastName,
            passwordHash,
        },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            emailVerified: true,
            twoFactorEnabled: true,
            createdAt: true,
        },
    });
    // Generate email verification token
    const verificationToken = crypto_1.default.randomBytes(32).toString('hex');
    await redis_1.redisService.set(`email_verification:${verificationToken}`, user.id, 24 * 60 * 60 // 24 hours
    );
    // TODO: Send verification email
    // Generate JWT token
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    logger_1.logger.info(`User registered: ${email}`);
    res.status(201).json({
        success: true,
        data: {
            user,
            token,
            verificationToken,
        },
        message: 'Registration successful. Please check your email to verify your account.',
    });
}));
// Login with email
router.post('/login', [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').notEmpty(),
], handleValidationErrors, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    // Find user with auth provider
    const user = await database_1.prisma.user.findUnique({
        where: { email },
        include: {
            authProviders: {
                where: { name: 'email' },
            },
        },
    });
    if (!user || !user.passwordHash) {
        throw (0, errorHandler_1.createError)('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }
    // Verify password
    const isValidPassword = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!isValidPassword) {
        throw (0, errorHandler_1.createError)('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }
    // Update last login
    await database_1.prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
    });
    // Generate JWT token
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    logger_1.logger.info(`User logged in: ${email}`);
    res.json({
        success: true,
        data: {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                emailVerified: user.emailVerified,
                twoFactorEnabled: user.twoFactorEnabled,
            },
            token,
        },
    });
}));
// Google OAuth
router.post('/google', [
    (0, express_validator_1.body)('token').notEmpty(),
], handleValidationErrors, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { token } = req.body;
    // TODO: Verify Google token
    // const googleUser = await verifyGoogleToken(token)
    // For now, mock Google user data
    const googleUser = {
        id: 'google_user_id',
        email: 'user@gmail.com',
        firstName: 'Google',
        lastName: 'User',
        avatar: 'https://lh3.googleusercontent.com/...',
    };
    // Find or create user
    let user = await database_1.prisma.user.findUnique({
        where: { email: googleUser.email },
    });
    if (!user) {
        user = await database_1.prisma.user.create({
            data: {
                email: googleUser.email,
                firstName: googleUser.firstName,
                lastName: googleUser.lastName,
                emailVerified: true,
                authProviders: {
                    create: {
                        name: 'google',
                        providerId: googleUser.id,
                    },
                },
            },
        });
    }
    else {
        // Check if Google provider exists
        const existingProvider = await database_1.prisma.authProvider.findFirst({
            where: {
                userId: user.id,
                name: 'google',
            },
        });
        if (!existingProvider) {
            await database_1.prisma.authProvider.create({
                data: {
                    userId: user.id,
                    name: 'google',
                    providerId: googleUser.id,
                },
            });
        }
    }
    // Update last login
    await database_1.prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
    });
    // Generate JWT token
    const jwtToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    logger_1.logger.info(`User logged in via Google: ${googleUser.email}`);
    res.json({
        success: true,
        data: {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                emailVerified: user.emailVerified,
                twoFactorEnabled: user.twoFactorEnabled,
            },
            token: jwtToken,
        },
    });
}));
// GitHub OAuth
router.post('/github', [
    (0, express_validator_1.body)('code').notEmpty(),
], handleValidationErrors, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { code } = req.body;
    // TODO: Exchange code for GitHub token and get user info
    // const githubUser = await getGithubUser(code)
    // For now, mock GitHub user data
    const githubUser = {
        id: 'github_user_id',
        email: 'user@github.com',
        login: 'githubuser',
        name: 'GitHub User',
        avatar: 'https://avatars.githubusercontent.com/...',
    };
    const [firstName, lastName] = githubUser.name ? githubUser.name.split(' ') : [githubUser.login, ''];
    // Find or create user
    let user = await database_1.prisma.user.findUnique({
        where: { email: githubUser.email },
    });
    if (!user) {
        user = await database_1.prisma.user.create({
            data: {
                email: githubUser.email,
                firstName,
                lastName: lastName || '',
                emailVerified: true,
                authProviders: {
                    create: {
                        name: 'github',
                        providerId: githubUser.id.toString(),
                    },
                },
            },
        });
    }
    else {
        // Check if GitHub provider exists
        const existingProvider = await database_1.prisma.authProvider.findFirst({
            where: {
                userId: user.id,
                name: 'github',
            },
        });
        if (!existingProvider) {
            await database_1.prisma.authProvider.create({
                data: {
                    userId: user.id,
                    name: 'github',
                    providerId: githubUser.id.toString(),
                },
            });
        }
    }
    // Update last login
    await database_1.prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
    });
    // Generate JWT token
    const jwtToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    logger_1.logger.info(`User logged in via GitHub: ${githubUser.email}`);
    res.json({
        success: true,
        data: {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                emailVerified: user.emailVerified,
                twoFactorEnabled: user.twoFactorEnabled,
            },
            token: jwtToken,
        },
    });
}));
// Verify email
router.post('/verify-email', [
    (0, express_validator_1.body)('token').notEmpty(),
], handleValidationErrors, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { token } = req.body;
    // Get user ID from Redis
    const userId = await redis_1.redisService.get(`email_verification:${token}`);
    if (!userId) {
        throw (0, errorHandler_1.createError)('Invalid or expired verification token', 400, 'INVALID_TOKEN');
    }
    // Update user
    const user = await database_1.prisma.user.update({
        where: { id: userId },
        data: { emailVerified: true },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            emailVerified: true,
        },
    });
    // Delete token from Redis
    await redis_1.redisService.del(`email_verification:${token}`);
    logger_1.logger.info(`Email verified: ${user.email}`);
    res.json({
        success: true,
        data: { user },
        message: 'Email verified successfully',
    });
}));
// Forgot password
router.post('/forgot-password', [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
], handleValidationErrors, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { email } = req.body;
    const user = await database_1.prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        // Don't reveal that user doesn't exist
        return res.json({
            success: true,
            message: 'If an account with that email exists, a password reset link has been sent.',
        });
    }
    // Generate reset token
    const resetToken = crypto_1.default.randomBytes(32).toString('hex');
    await redis_1.redisService.set(`password_reset:${resetToken}`, user.id, 60 * 60 // 1 hour
    );
    // TODO: Send password reset email
    logger_1.logger.info(`Password reset requested: ${email}`);
    res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
        resetToken, // Only for development
    });
}));
// Reset password
router.post('/reset-password', [
    (0, express_validator_1.body)('token').notEmpty(),
    (0, express_validator_1.body)('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
], handleValidationErrors, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { token, password } = req.body;
    // Get user ID from Redis
    const userId = await redis_1.redisService.get(`password_reset:${token}`);
    if (!userId) {
        throw (0, errorHandler_1.createError)('Invalid or expired reset token', 400, 'INVALID_TOKEN');
    }
    // Hash new password
    const passwordHash = await bcryptjs_1.default.hash(password, 12);
    // Update user
    const user = await database_1.prisma.user.update({
        where: { id: userId },
        data: { passwordHash },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
        },
    });
    // Delete token from Redis
    await redis_1.redisService.del(`password_reset:${token}`);
    logger_1.logger.info(`Password reset completed: ${user.email}`);
    res.json({
        success: true,
        data: { user },
        message: 'Password reset successfully',
    });
}));
// Get current user
router.get('/me', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        throw (0, errorHandler_1.createError)('Authentication required', 401, 'UNAUTHORIZED');
    }
    res.json({
        success: true,
        data: { user: req.user },
    });
}));
exports.default = router;
