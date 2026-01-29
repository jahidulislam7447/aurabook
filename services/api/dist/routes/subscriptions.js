"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
// Get organization subscriptions
router.get('/', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const organizationId = req.organization.id;
    const subscriptions = await database_1.prisma.subscription.findMany({
        where: { organizationId },
        include: {
            plan: true,
        },
        orderBy: { createdAt: 'desc' },
    });
    res.json({
        success: true,
        data: { subscriptions },
    });
}));
// Get available plans
router.get('/plans', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const plans = await database_1.prisma.subscriptionPlan.findMany({
        where: { isActive: true },
        orderBy: { price: 'asc' },
    });
    res.json({
        success: true,
        data: { plans },
    });
}));
exports.default = router;
