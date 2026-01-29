"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const organization_1 = require("../middleware/organization");
const database_1 = require("../config/database");
const router = (0, express_1.Router)();
// Apply auth and organization middleware to all dashboard routes
router.use(auth_1.authMiddleware);
router.use(organization_1.organizationMiddleware);
// Get dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        const organizationId = req.organization?.id;
        if (!organizationId) {
            return res.status(400).json({ error: 'Organization not found' });
        }
        // Get user count
        const totalUsers = await database_1.prisma.userRole.count({
            where: { organizationId }
        });
        // Get active apps count
        const activeApps = await database_1.prisma.organizationApp.count({
            where: {
                organizationId,
                status: 'active'
            }
        });
        // Get monthly revenue (mock data for now)
        const monthlyRevenue = 2999;
        // Get API calls (mock data for now)
        const apiCalls = 45678;
        // Calculate growth rates (mock data for now)
        const userGrowth = 12.5;
        const revenueGrowth = 8.3;
        res.json({
            totalUsers,
            activeApps,
            monthlyRevenue,
            apiCalls,
            userGrowth,
            revenueGrowth
        });
    }
    catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
});
// Get recent activities
router.get('/activities', async (req, res) => {
    try {
        const organizationId = req.organization?.id;
        if (!organizationId) {
            return res.status(400).json({ error: 'Organization not found' });
        }
        // Get recent user roles (invitations/new users)
        const recentUserRoles = await database_1.prisma.userRole.findMany({
            where: { organizationId },
            include: {
                user: {
                    select: { firstName: true, lastName: true, email: true }
                }
            },
            orderBy: { joinedAt: 'desc' },
            take: 5
        });
        // Get recent organization apps
        const recentApps = await database_1.prisma.organizationApp.findMany({
            where: { organizationId },
            include: {
                app: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 3
        });
        // Combine and format activities
        const activities = [
            ...recentUserRoles.map(role => ({
                id: `user-${role.id}`,
                type: 'user_added',
                description: `${role.user.firstName} ${role.user.lastName} joined the organization`,
                timestamp: role.joinedAt.toISOString()
            })),
            ...recentApps.map(orgApp => ({
                id: `app-${orgApp.id}`,
                type: 'app_installed',
                description: `${orgApp.app?.name || 'Unknown app'} app was installed`,
                timestamp: orgApp.createdAt.toISOString()
            }))
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 10);
        res.json(activities);
    }
    catch (error) {
        console.error('Dashboard activities error:', error);
        res.status(500).json({ error: 'Failed to fetch activities' });
    }
});
// Get available apps for organization
router.get('/apps', async (req, res) => {
    try {
        const organizationId = req.organization?.id;
        if (!organizationId) {
            return res.status(400).json({ error: 'Organization not found' });
        }
        // Get all apps
        const apps = await database_1.prisma.app.findMany({
            where: { isActive: true },
            include: {
                organizationApps: {
                    where: { organizationId }
                }
            }
        });
        // Group by category
        const appsByCategory = apps.reduce((acc, app) => {
            const categoryName = app.category;
            if (!acc[categoryName]) {
                acc[categoryName] = {
                    name: categoryName,
                    apps: []
                };
            }
            const isInstalled = app.organizationApps.length > 0;
            const status = isInstalled ? 'installed' : 'available';
            // Extract pricing info from JSON
            const pricing = app.pricing;
            const pricingType = pricing?.type || 'free';
            const pricingPrice = pricing?.price;
            acc[categoryName].apps.push({
                id: app.id,
                name: app.name,
                description: app.description,
                category: app.category,
                icon: app.logo,
                version: app.version,
                status,
                users: Math.floor(Math.random() * 10000), // Mock data
                rating: 4.5, // Mock data
                pricing: {
                    type: pricingType.toLowerCase(),
                    price: pricingPrice || undefined
                }
            });
            return acc;
        }, {});
        res.json(Object.values(appsByCategory));
    }
    catch (error) {
        console.error('Dashboard apps error:', error);
        res.status(500).json({ error: 'Failed to fetch apps' });
    }
});
// Install an app
router.post('/apps/:appId/install', async (req, res) => {
    try {
        const { appId } = req.params;
        const organizationId = req.organization?.id;
        if (!organizationId) {
            return res.status(400).json({ error: 'Organization not found' });
        }
        // Check if app exists
        const app = await database_1.prisma.app.findUnique({
            where: { id: appId }
        });
        if (!app) {
            return res.status(404).json({ error: 'App not found' });
        }
        // Check if already installed
        const existingInstallation = await database_1.prisma.organizationApp.findFirst({
            where: {
                organizationId,
                appId
            }
        });
        if (existingInstallation) {
            return res.status(400).json({ error: 'App already installed' });
        }
        // Install the app
        await database_1.prisma.organizationApp.create({
            data: {
                organizationId,
                appId,
                status: 'active',
                settings: {},
                enabledAt: new Date()
            }
        });
        res.json({ success: true });
    }
    catch (error) {
        console.error('Install app error:', error);
        res.status(500).json({ error: 'Failed to install app' });
    }
});
// Uninstall an app
router.delete('/apps/:appId/install', async (req, res) => {
    try {
        const { appId } = req.params;
        const organizationId = req.organization?.id;
        if (!organizationId) {
            return res.status(400).json({ error: 'Organization not found' });
        }
        // Find and delete the installation
        const installation = await database_1.prisma.organizationApp.findFirst({
            where: {
                organizationId,
                appId
            }
        });
        if (!installation) {
            return res.status(404).json({ error: 'App not installed' });
        }
        await database_1.prisma.organizationApp.delete({
            where: { id: installation.id }
        });
        res.json({ success: true });
    }
    catch (error) {
        console.error('Uninstall app error:', error);
        res.status(500).json({ error: 'Failed to uninstall app' });
    }
});
exports.default = router;
