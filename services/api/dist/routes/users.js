"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const database_1 = require("../config/database");
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
// Update user profile
router.put('/profile', [
    (0, express_validator_1.body)('firstName').optional().trim().isLength({ min: 1, max: 50 }),
    (0, express_validator_1.body)('lastName').optional().trim().isLength({ min: 1, max: 50 }),
], (0, errorHandler_1.asyncHandler)(async (req, res) => {
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
    const { firstName, lastName } = req.body;
    const userId = req.user.id;
    const user = await database_1.prisma.user.update({
        where: { id: userId },
        data: { firstName, lastName },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            emailVerified: true,
            twoFactorEnabled: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    res.json({
        success: true,
        data: { user },
    });
}));
// Change password
router.put('/password', [
    (0, express_validator_1.body)('currentPassword').notEmpty(),
    (0, express_validator_1.body)('newPassword').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
], (0, errorHandler_1.asyncHandler)(async (req, res) => {
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
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    // Get user with password
    const user = await database_1.prisma.user.findUnique({
        where: { id: userId },
        select: { passwordHash: true },
    });
    if (!user || !user.passwordHash) {
        throw (0, errorHandler_1.createError)('User not found or no password set', 400, 'INVALID_USER');
    }
    // Verify current password
    const bcrypt = require('bcryptjs');
    const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValidPassword) {
        throw (0, errorHandler_1.createError)('Current password is incorrect', 400, 'INVALID_PASSWORD');
    }
    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 12);
    // Update password
    await database_1.prisma.user.update({
        where: { id: userId },
        data: { passwordHash: newPasswordHash },
    });
    res.json({
        success: true,
        message: 'Password updated successfully',
    });
}));
exports.default = router;
