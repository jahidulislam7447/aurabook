"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
// Get available apps
router.get('/marketplace', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { category, search } = req.query;
    const where = { isActive: true, isPublic: true };
    if (category) {
        where.category = category;
    }
    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { shortDescription: { contains: search, mode: 'insensitive' } },
        ];
    }
    const apps = await database_1.prisma.app.findMany({
        where,
        orderBy: { name: 'asc' },
    });
    res.json({
        success: true,
        data: { apps },
    });
}));
// Get organization's installed apps
router.get('/installed', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const organizationId = req.organization.id;
    const organizationApps = await database_1.prisma.organizationApp.findMany({
        where: { organizationId },
        include: {
            app: true,
        },
        orderBy: { createdAt: 'desc' },
    });
    res.json({
        success: true,
        data: { organizationApps },
    });
}));
exports.default = router;
