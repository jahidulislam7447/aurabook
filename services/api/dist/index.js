"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("./config/logger");
const database_1 = require("./config/database");
const redis_1 = require("./config/redis");
const errorHandler_1 = require("./middleware/errorHandler");
const auth_1 = require("./middleware/auth");
const organization_1 = require("./middleware/organization");
const superAdmin_1 = require("./middleware/superAdmin");
// Routes
const auth_2 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const organizations_1 = __importDefault(require("./routes/organizations"));
const subscriptions_1 = __importDefault(require("./routes/subscriptions"));
const billing_1 = __importDefault(require("./routes/billing"));
const apps_1 = __importDefault(require("./routes/apps"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const admin_1 = __importDefault(require("./routes/admin"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
// Middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)('combined', { stream: { write: (message) => logger_1.logger.info(message.trim()) } }));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use(limiter);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
    });
});
// API Routes
app.use('/api/auth', auth_2.default);
app.use('/api/users', auth_1.authMiddleware, users_1.default);
app.use('/api/organizations', auth_1.authMiddleware, organizations_1.default);
app.use('/api/subscriptions', auth_1.authMiddleware, organization_1.organizationMiddleware, subscriptions_1.default);
app.use('/api/billing', auth_1.authMiddleware, organization_1.organizationMiddleware, billing_1.default);
app.use('/api/apps', auth_1.authMiddleware, organization_1.organizationMiddleware, apps_1.default);
app.use('/api/notifications', auth_1.authMiddleware, notifications_1.default);
app.use('/api/analytics', auth_1.authMiddleware, organization_1.organizationMiddleware, analytics_1.default);
app.use('/api/admin', auth_1.authMiddleware, superAdmin_1.requireSuperAdmin, admin_1.default);
app.use('/api/dashboard', dashboard_1.default);
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: 'Endpoint not found',
        },
    });
});
// Error handling middleware (must be last)
app.use(errorHandler_1.errorHandler);
// Graceful shutdown
process.on('SIGTERM', async () => {
    logger_1.logger.info('SIGTERM received, shutting down gracefully');
    await (0, database_1.disconnectDatabase)();
    await (0, redis_1.disconnectRedis)();
    process.exit(0);
});
process.on('SIGINT', async () => {
    logger_1.logger.info('SIGINT received, shutting down gracefully');
    await (0, database_1.disconnectDatabase)();
    await (0, redis_1.disconnectRedis)();
    process.exit(0);
});
// Start server
async function startServer() {
    try {
        await (0, database_1.connectDatabase)();
        await (0, redis_1.connectRedis)();
        app.listen(PORT, () => {
            logger_1.logger.info(`Server running on port ${PORT}`);
            logger_1.logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
            logger_1.logger.info(`Health check: http://localhost:${PORT}/health`);
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
}
startServer().catch((error) => {
    logger_1.logger.error('Server startup failed:', error);
    process.exit(1);
});
