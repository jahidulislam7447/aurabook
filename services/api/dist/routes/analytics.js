"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
// Get organization analytics
router.get('/overview', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const organizationId = req.organization.id;
    const { period = '30d' } = req.query;
    // Calculate date range
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    // Get analytics data
    const [totalEvents, activeUsers, appUsage, usageMetrics,] = await Promise.all([
        database_1.prisma.analyticsEvent.count({
            where: {
                organizationId,
                timestamp: { gte: startDate },
            },
        }),
        database_1.prisma.analyticsEvent.findMany({
            where: {
                organizationId,
                timestamp: { gte: startDate },
            },
            select: { userId: true },
            distinct: ['userId'],
        }).then(users => users.length),
        database_1.prisma.analyticsEvent.groupBy({
            by: ['event'],
            where: {
                organizationId,
                timestamp: { gte: startDate },
            },
            _count: true,
            orderBy: { _count: { event: 'desc' } },
            take: 10,
        }),
        database_1.prisma.usageMetrics.findMany({
            where: {
                organizationId,
                timestamp: { gte: startDate },
            },
            orderBy: { timestamp: 'desc' },
            take: days,
        }),
    ]);
    res.json({
        success: true,
        data: {
            overview: {
                totalEvents,
                activeUsers,
                period,
            },
            appUsage,
            usageMetrics,
        },
    });
}));
exports.default = router;
