"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.createError = exports.errorHandler = void 0;
const logger_1 = require("../config/logger");
const errorHandler = (err, req, res, next) => {
    // Log error
    logger_1.logger.error('Error occurred:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
    });
    // Default error
    let statusCode = err.statusCode || 500;
    let code = err.code || 'INTERNAL_ERROR';
    let message = err.message || 'Internal server error';
    // Handle specific error types
    if (err.name === 'ValidationError') {
        statusCode = 400;
        code = 'VALIDATION_ERROR';
        message = 'Validation failed';
    }
    else if (err.name === 'CastError') {
        statusCode = 400;
        code = 'INVALID_ID';
        message = 'Invalid ID format';
    }
    else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        code = 'INVALID_TOKEN';
        message = 'Invalid token';
    }
    else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        code = 'TOKEN_EXPIRED';
        message = 'Token expired';
    }
    else if (err.name === 'PrismaClientKnownRequestError') {
        const prismaError = err;
        switch (prismaError.code) {
            case 'P2002':
                statusCode = 409;
                code = 'DUPLICATE_ENTRY';
                message = 'Resource already exists';
                break;
            case 'P2025':
                statusCode = 404;
                code = 'NOT_FOUND';
                message = 'Resource not found';
                break;
            case 'P2003':
                statusCode = 400;
                code = 'FOREIGN_KEY_CONSTRAINT';
                message = 'Invalid reference';
                break;
            default:
                statusCode = 500;
                code = 'DATABASE_ERROR';
                message = 'Database operation failed';
        }
    }
    // Send error response
    const errorResponse = {
        success: false,
        error: {
            code,
            message,
        },
    };
    // Include details in development
    if (process.env.NODE_ENV === 'development') {
        errorResponse.error.details = err.details || err.stack;
    }
    res.status(statusCode).json(errorResponse);
};
exports.errorHandler = errorHandler;
const createError = (message, statusCode = 500, code, details) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.code = code;
    error.details = details;
    return error;
};
exports.createError = createError;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
