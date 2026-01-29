"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const database_1 = require("../config/database");
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
// Get user's organizations
router.get('/', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const organizations = await database_1.prisma.organization.findMany({
        where: {
            userRoles: {
                some: {
                    userId: userId,
                    status: 'active',
                },
            },
        },
        include: {
            userRoles: {
                where: {
                    userId: userId,
                },
                select: {
                    role: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
            _count: {
                select: {
                    userRoles: true,
                },
            },
        },
    });
    res.json({
        success: true,
        data: { organizations },
    });
}));
// Create organization
router.post('/', [
    (0, express_validator_1.body)('name').trim().isLength({ min: 1, max: 100 }),
    (0, express_validator_1.body)('type').isIn(['business', 'enterprise', 'agency']),
    (0, express_validator_1.body)('slug').optional().trim().isLength({ min: 1, max: 50 }).matches(/^[a-z0-9-]+$/),
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
    const { name, type, slug } = req.body;
    const userId = req.user.id;
    // Generate slug if not provided
    let organizationSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    // Ensure slug is unique
    let uniqueSlug = organizationSlug;
    let counter = 1;
    while (await database_1.prisma.organization.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${organizationSlug}-${counter}`;
        counter++;
    }
    // Create organization
    const organization = await database_1.prisma.organization.create({
        data: {
            name,
            slug: uniqueSlug,
            type,
            ownerId: userId,
            userRoles: {
                create: {
                    userId: userId,
                    roleId: 'owner-role-id', // TODO: Get or create owner role
                },
            },
        },
    });
    res.status(201).json({
        success: true,
        data: { organization },
    });
}));
exports.default = router;
