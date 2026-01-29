"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
// Get organization invoices
router.get('/invoices', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const organizationId = req.organization.id;
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [invoices, total] = await Promise.all([
        database_1.prisma.invoice.findMany({
            where: { organizationId },
            include: {
                subscription: {
                    select: {
                        plan: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: Number(limit),
        }),
        database_1.prisma.invoice.count({
            where: { organizationId },
        }),
    ]);
    res.json({
        success: true,
        data: {
            invoices,
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
exports.default = router;
