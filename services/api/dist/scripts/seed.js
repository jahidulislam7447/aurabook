"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function seed() {
    console.log('🌱 Starting database seeding...');
    try {
        // Create default permissions
        console.log('Creating permissions...');
        const permissions = await Promise.all([
            // User permissions
            prisma.permission.create({
                data: {
                    name: 'users.read',
                    resource: 'users',
                    action: 'read',
                    description: 'Read user information',
                },
            }),
            prisma.permission.create({
                data: {
                    name: 'users.write',
                    resource: 'users',
                    action: 'write',
                    description: 'Write user information',
                },
            }),
            prisma.permission.create({
                data: {
                    name: 'users.delete',
                    resource: 'users',
                    action: 'delete',
                    description: 'Delete users',
                },
            }),
            // Organization permissions
            prisma.permission.create({
                data: {
                    name: 'organizations.read',
                    resource: 'organizations',
                    action: 'read',
                    description: 'Read organization information',
                },
            }),
            prisma.permission.create({
                data: {
                    name: 'organizations.write',
                    resource: 'organizations',
                    action: 'write',
                    description: 'Write organization information',
                },
            }),
            prisma.permission.create({
                data: {
                    name: 'organizations.delete',
                    resource: 'organizations',
                    action: 'delete',
                    description: 'Delete organizations',
                },
            }),
            // Billing permissions
            prisma.permission.create({
                data: {
                    name: 'billing.read',
                    resource: 'billing',
                    action: 'read',
                    description: 'Read billing information',
                },
            }),
            prisma.permission.create({
                data: {
                    name: 'billing.write',
                    resource: 'billing',
                    action: 'write',
                    description: 'Write billing information',
                },
            }),
            // Apps permissions
            prisma.permission.create({
                data: {
                    name: 'apps.read',
                    resource: 'apps',
                    action: 'read',
                    description: 'Read app information',
                },
            }),
            prisma.permission.create({
                data: {
                    name: 'apps.write',
                    resource: 'apps',
                    action: 'write',
                    description: 'Write app information',
                },
            }),
        ]);
        // Create system roles
        console.log('Creating system roles...');
        const ownerRole = await prisma.role.create({
            data: {
                name: 'owner',
                description: 'Organization owner with full access',
                isSystem: true,
            },
        });
        const adminRole = await prisma.role.create({
            data: {
                name: 'admin',
                description: 'Organization administrator with most permissions',
                isSystem: true,
            },
        });
        const managerRole = await prisma.role.create({
            data: {
                name: 'manager',
                description: 'Manager with limited administrative permissions',
                isSystem: true,
            },
        });
        const staffRole = await prisma.role.create({
            data: {
                name: 'staff',
                description: 'Staff member with basic permissions',
                isSystem: true,
            },
        });
        // Assign all permissions to owner role
        console.log('Assigning permissions to roles...');
        await Promise.all(permissions.map(permission => prisma.rolePermission.create({
            data: {
                roleId: ownerRole.id,
                permissionId: permission.id,
            },
        })));
        // Assign most permissions to admin role (except delete)
        const adminPermissions = permissions.filter(p => !p.action.includes('delete'));
        await Promise.all(adminPermissions.map(permission => prisma.rolePermission.create({
            data: {
                roleId: adminRole.id,
                permissionId: permission.id,
            },
        })));
        // Assign read permissions to manager role
        const managerPermissions = permissions.filter(p => p.action === 'read');
        await Promise.all(managerPermissions.map(permission => prisma.rolePermission.create({
            data: {
                roleId: managerRole.id,
                permissionId: permission.id,
            },
        })));
        // Assign basic read permissions to staff role
        const staffPermissions = permissions.filter(p => p.action === 'read' && (p.resource === 'apps' || p.resource === 'users'));
        await Promise.all(staffPermissions.map(permission => prisma.rolePermission.create({
            data: {
                roleId: staffRole.id,
                permissionId: permission.id,
            },
        })));
        // Create subscription plans
        console.log('Creating subscription plans...');
        await Promise.all([
            prisma.subscriptionPlan.create({
                data: {
                    name: 'Starter',
                    description: 'Perfect for small businesses getting started',
                    price: 29,
                    currency: 'USD',
                    interval: 'month',
                    features: [
                        { name: 'Users', value: 5, description: 'Up to 5 users' },
                        { name: 'Storage', value: '10 GB', description: 'Cloud storage' },
                        { name: 'Apps', value: 3, description: 'Up to 3 apps' },
                        { name: 'Support', value: 'Email', description: 'Email support' },
                    ],
                    apps: ['crm', 'hr'],
                    isActive: true,
                },
            }),
            prisma.subscriptionPlan.create({
                data: {
                    name: 'Professional',
                    description: 'Ideal for growing businesses',
                    price: 99,
                    currency: 'USD',
                    interval: 'month',
                    features: [
                        { name: 'Users', value: 25, description: 'Up to 25 users' },
                        { name: 'Storage', value: '100 GB', description: 'Cloud storage' },
                        { name: 'Apps', value: 10, description: 'Up to 10 apps' },
                        { name: 'Support', value: 'Priority', description: 'Priority email & chat support' },
                        { name: 'API Access', value: true, description: 'API access included' },
                    ],
                    apps: ['crm', 'erp', 'hr', 'pos', 'project_management'],
                    isActive: true,
                },
            }),
            prisma.subscriptionPlan.create({
                data: {
                    name: 'Enterprise',
                    description: 'Complete solution for large organizations',
                    price: 299,
                    currency: 'USD',
                    interval: 'month',
                    features: [
                        { name: 'Users', value: 'Unlimited', description: 'Unlimited users' },
                        { name: 'Storage', value: '1 TB', description: 'Cloud storage' },
                        { name: 'Apps', value: 'All', description: 'All apps included' },
                        { name: 'Support', value: '24/7', description: '24/7 phone & dedicated support' },
                        { name: 'API Access', value: true, description: 'Advanced API access' },
                        { name: 'Custom Integrations', value: true, description: 'Custom integration support' },
                        { name: 'SLA', value: '99.9%', description: 'Service Level Agreement' },
                    ],
                    apps: ['crm', 'erp', 'hr', 'pos', 'project_management', 'accounting', 'inventory', 'ecommerce', 'communication', 'analytics'],
                    isActive: true,
                },
            }),
        ]);
        // Create sample apps
        console.log('Creating sample apps...');
        await Promise.all([
            prisma.app.create({
                data: {
                    name: 'CRM Pro',
                    slug: 'crm-pro',
                    description: 'Complete Customer Relationship Management system with advanced features for managing customer interactions, sales pipeline, and marketing automation.',
                    shortDescription: 'Advanced CRM for modern businesses',
                    logo: '/apps/crm-logo.png',
                    screenshots: ['/apps/crm-1.png', '/apps/crm-2.png'],
                    version: '2.1.0',
                    category: 'CRM',
                    tags: ['sales', 'marketing', 'customer-service'],
                    features: [
                        'Contact Management',
                        'Sales Pipeline',
                        'Email Marketing',
                        'Analytics Dashboard',
                        'Mobile App',
                    ],
                    pricing: {
                        type: 'paid',
                        basePrice: 19,
                        currency: 'USD',
                        billingInterval: 'month',
                    },
                    dependencies: [],
                    developer: 'AuraTechIT',
                    website: 'https://auratechit.com/apps/crm',
                    documentation: 'https://docs.auratechit.com/crm',
                    isActive: true,
                    isPublic: true,
                },
            }),
            prisma.app.create({
                data: {
                    name: 'ERP Suite',
                    slug: 'erp-suite',
                    description: 'Enterprise Resource Planning system that integrates all your business processes into one unified platform.',
                    shortDescription: 'Complete ERP solution',
                    logo: '/apps/erp-logo.png',
                    screenshots: ['/apps/erp-1.png', '/apps/erp-2.png'],
                    version: '3.0.1',
                    category: 'ERP',
                    tags: ['operations', 'finance', 'inventory'],
                    features: [
                        'Financial Management',
                        'Supply Chain',
                        'Inventory Control',
                        'Production Planning',
                        'Quality Management',
                    ],
                    pricing: {
                        type: 'paid',
                        basePrice: 49,
                        currency: 'USD',
                        billingInterval: 'month',
                    },
                    dependencies: [],
                    developer: 'AuraTechIT',
                    website: 'https://auratechit.com/apps/erp',
                    documentation: 'https://docs.auratechit.com/erp',
                    isActive: true,
                    isPublic: true,
                },
            }),
            prisma.app.create({
                data: {
                    name: 'POS System',
                    slug: 'pos-system',
                    description: 'Modern Point of Sale system with inventory management, payment processing, and real-time analytics.',
                    shortDescription: 'Advanced POS for retail',
                    logo: '/apps/pos-logo.png',
                    screenshots: ['/apps/pos-1.png', '/apps/pos-2.png'],
                    version: '1.5.2',
                    category: 'POS',
                    tags: ['retail', 'payments', 'inventory'],
                    features: [
                        'Sales Processing',
                        'Inventory Management',
                        'Customer Management',
                        'Reporting & Analytics',
                        'Multi-store Support',
                    ],
                    pricing: {
                        type: 'paid',
                        basePrice: 29,
                        currency: 'USD',
                        billingInterval: 'month',
                    },
                    dependencies: [],
                    developer: 'AuraTechIT',
                    website: 'https://auratechit.com/apps/pos',
                    documentation: 'https://docs.auratechit.com/pos',
                    isActive: true,
                    isPublic: true,
                },
            }),
        ]);
        // Create demo user
        console.log('Creating demo user...');
        const hashedPassword = await bcryptjs_1.default.hash('demo123456', 12);
        const demoUser = await prisma.user.create({
            data: {
                email: 'demo@auratechit.com',
                firstName: 'Demo',
                lastName: 'User',
                passwordHash: hashedPassword,
                emailVerified: true,
            },
        });
        // Create demo organization
        console.log('Creating demo organization...');
        const demoOrg = await prisma.organization.create({
            data: {
                name: 'Demo Company',
                slug: 'demo-company',
                type: 'business',
                plan: 'professional',
                status: 'active',
                ownerId: demoUser.id,
                userRoles: {
                    create: {
                        userId: demoUser.id,
                        roleId: ownerRole.id,
                    },
                },
            },
        });
        console.log('✅ Database seeding completed successfully!');
        console.log('');
        console.log('Demo credentials:');
        console.log('Email: demo@auratechit.com');
        console.log('Password: demo123456');
        console.log('');
        console.log('Organization: Demo Company');
    }
    catch (error) {
        console.error('❌ Error during seeding:', error);
        throw error;
    }
    finally {
        await prisma.$disconnect();
    }
}
seed()
    .catch((error) => {
    console.error(error);
    process.exit(1);
});
