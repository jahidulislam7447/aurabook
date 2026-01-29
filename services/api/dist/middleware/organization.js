"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireOwnership = exports.requireRole = exports.requirePermission = exports.organizationMiddleware = void 0;
const database_1 = require("../config/database");
const organizationMiddleware = async (req, res, next) => {
    try {
        const organizationId = req.headers['x-organization-id'];
        if (!organizationId) {
            res.status(400).json({
                success: false,
                error: {
                    code: 'ORGANIZATION_REQUIRED',
                    message: 'Organization ID is required',
                },
            });
            return;
        }
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Authentication required',
                },
            });
            return;
        }
        // Fetch organization
        const organization = await database_1.prisma.organization.findUnique({
            where: { id: organizationId },
            select: {
                id: true,
                name: true,
                slug: true,
                type: true,
                plan: true,
                status: true,
                ownerId: true,
            },
        });
        if (!organization) {
            res.status(404).json({
                success: false,
                error: {
                    code: 'ORGANIZATION_NOT_FOUND',
                    message: 'Organization not found',
                },
            });
            return;
        }
        // Check if organization is active
        if (organization.status !== 'active') {
            res.status(403).json({
                success: false,
                error: {
                    code: 'ORGANIZATION_INACTIVE',
                    message: 'Organization is not active',
                },
            });
            return;
        }
        // Fetch user role in this organization
        const userRole = await database_1.prisma.userRole.findUnique({
            where: {
                userId_organizationId: {
                    userId: req.user.id,
                    organizationId: organizationId,
                },
            },
            select: {
                id: true,
                status: true,
                role: {
                    select: {
                        name: true,
                        permissions: {
                            select: {
                                permission: {
                                    select: {
                                        resource: true,
                                        action: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!userRole || userRole.status !== 'active') {
            res.status(403).json({
                success: false,
                error: {
                    code: 'ACCESS_DENIED',
                    message: 'Access denied to this organization',
                },
            });
            return;
        }
        // Attach organization and user role to request
        req.organization = organization;
        req.userRole = {
            id: userRole.id,
            role: {
                name: userRole.role.name,
                permissions: userRole.role.permissions.map(p => p.permission),
            },
        };
        next();
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'Failed to validate organization access',
            },
        });
    }
};
exports.organizationMiddleware = organizationMiddleware;
const requirePermission = (resource, action) => {
    return (req, res, next) => {
        if (!req.userRole) {
            res.status(403).json({
                success: false,
                error: {
                    code: 'ACCESS_DENIED',
                    message: 'No role assigned',
                },
            });
            return;
        }
        const hasPermission = req.userRole.role.permissions.some(permission => permission.resource === resource && permission.action === action);
        if (!hasPermission) {
            res.status(403).json({
                success: false,
                error: {
                    code: 'INSUFFICIENT_PERMISSIONS',
                    message: `Insufficient permissions for ${action} on ${resource}`,
                },
            });
            return;
        }
        next();
    };
};
exports.requirePermission = requirePermission;
const requireRole = (roleName) => {
    return (req, res, next) => {
        if (!req.userRole) {
            res.status(403).json({
                success: false,
                error: {
                    code: 'ACCESS_DENIED',
                    message: 'No role assigned',
                },
            });
            return;
        }
        if (req.userRole.role.name !== roleName) {
            res.status(403).json({
                success: false,
                error: {
                    code: 'INSUFFICIENT_ROLE',
                    message: `Role '${roleName}' required`,
                },
            });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
const requireOwnership = (req, res, next) => {
    if (!req.organization || !req.user) {
        res.status(403).json({
            success: false,
            error: {
                code: 'ACCESS_DENIED',
                message: 'Organization or user not found',
            },
        });
        return;
    }
    if (req.organization.ownerId !== req.user.id) {
        res.status(403).json({
            success: false,
            error: {
                code: 'ACCESS_DENIED',
                message: 'Organization ownership required',
            },
        });
        return;
    }
    next();
};
exports.requireOwnership = requireOwnership;
