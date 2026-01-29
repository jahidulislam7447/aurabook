"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
// Get user notifications
router.get('/', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const where = { userId };
    if (unreadOnly === 'true') {
        where.readAt = null;
    }
    const [notifications, total] = await Promise.all([
        database_1.prisma.notification.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: Number(limit),
        }),
        database_1.prisma.notification.count({ where }),
    ]);
    res.json({
        success: true,
        data: {
            notifications,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / Number(limit)),
                hasNext: Number(page) < Math.ceil(total / Number(limit)),
                hasPrev: Number(page) > 1,
            },
        },
    });
}));
// Mark notification as read
router.put('/:id/read', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const notification = await database_1.prisma.notification.updateMany({
        where: {
            id,
            userId,
            readAt: null,
        },
        data: { readAt: new Date() },
    });
    res.json({
        success: true,
        data: { updated: notification.count },
    });
}));
// Mark all notifications as read
router.put('/read-all', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const result = await database_1.prisma.notification.updateMany({
        where: {
            userId,
            readAt: null,
        },
        data: { readAt: new Date() },
    });
    res.json({
        success: true,
        data: { updated: result.count },
    });
}));
exports.default = router;
