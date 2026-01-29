"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisService = exports.RedisService = void 0;
exports.connectRedis = connectRedis;
exports.getRedisClient = getRedisClient;
exports.disconnectRedis = disconnectRedis;
const redis_1 = require("redis");
const logger_1 = require("./logger");
let redisClient = null;
async function connectRedis() {
    if (redisClient) {
        return redisClient;
    }
    try {
        redisClient = (0, redis_1.createClient)({
            url: process.env.REDIS_URL || 'redis://localhost:6379',
            socket: {
                reconnectStrategy: (retries) => {
                    if (retries > 10) {
                        logger_1.logger.error('Redis reconnection failed after 10 attempts');
                        return new Error('Redis reconnection failed');
                    }
                    return Math.min(retries * 50, 1000);
                }
            }
        });
        redisClient.on('error', (err) => {
            logger_1.logger.error('Redis Client Error:', err);
        });
        redisClient.on('connect', () => {
            logger_1.logger.info('Redis Client Connected');
        });
        redisClient.on('ready', () => {
            logger_1.logger.info('Redis Client Ready');
        });
        redisClient.on('end', () => {
            logger_1.logger.info('Redis Client Disconnected');
        });
        await redisClient.connect();
        return redisClient;
    }
    catch (error) {
        logger_1.logger.error('Failed to connect to Redis:', error);
        throw error;
    }
}
function getRedisClient() {
    if (!redisClient) {
        throw new Error('Redis client not initialized. Call connectRedis() first.');
    }
    return redisClient;
}
async function disconnectRedis() {
    if (redisClient) {
        await redisClient.quit();
        redisClient = undefined;
        logger_1.logger.info('Redis disconnected');
    }
}
// Redis utility functions
class RedisService {
    constructor(client) {
        this.client = client;
    }
    async set(key, value, expireInSeconds) {
        if (expireInSeconds) {
            await this.client.setEx(key, expireInSeconds, value);
        }
        else {
            await this.client.set(key, value);
        }
    }
    async get(key) {
        return await this.client.get(key);
    }
    async del(key) {
        return await this.client.del(key);
    }
    async exists(key) {
        return await this.client.exists(key);
    }
    async expire(key, seconds) {
        return await this.client.expire(key, seconds);
    }
    async hSet(key, field, value) {
        return await this.client.hSet(key, field, value);
    }
    async hGet(key, field) {
        return await this.client.hGet(key, field);
    }
    async hGetAll(key) {
        return await this.client.hGetAll(key);
    }
    async hDel(key, field) {
        return await this.client.hDel(key, field);
    }
    async lPush(key, ...values) {
        return await this.client.lPush(key, values);
    }
    async rPop(key) {
        return await this.client.rPop(key);
    }
    async lLen(key) {
        return await this.client.lLen(key);
    }
}
exports.RedisService = RedisService;
exports.redisService = new RedisService(redisClient);
