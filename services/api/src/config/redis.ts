import { createClient, RedisClientType } from 'redis'
import { logger } from './logger'

let redisClient: RedisClientType | null = null

export async function connectRedis(): Promise<RedisClientType> {
  if (redisClient) {
    return redisClient
  }

  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            logger.error('Redis reconnection failed after 10 attempts')
            return new Error('Redis reconnection failed')
          }
          return Math.min(retries * 50, 1000)
        }
      }
    })

    redisClient.on('error', (err) => {
      logger.error('Redis Client Error:', err)
    })

    redisClient.on('connect', () => {
      logger.info('Redis Client Connected')
    })

    redisClient.on('ready', () => {
      logger.info('Redis Client Ready')
    })

    redisClient.on('end', () => {
      logger.info('Redis Client Disconnected')
    })

    await redisClient.connect()
    return redisClient
  } catch (error) {
    logger.error('Failed to connect to Redis:', error)
    throw error
  }
}

export function getRedisClient(): RedisClientType {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call connectRedis() first.')
  }
  return redisClient
}

export async function disconnectRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit()
    redisClient = undefined as any
    logger.info('Redis disconnected')
  }
}

// Redis utility functions
export class RedisService {
  private client: RedisClientType

  constructor(client: RedisClientType) {
    this.client = client
  }

  async set(key: string, value: string, expireInSeconds?: number): Promise<void> {
    if (expireInSeconds) {
      await this.client.setEx(key, expireInSeconds, value)
    } else {
      await this.client.set(key, value)
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key)
  }

  async del(key: string): Promise<number> {
    return await this.client.del(key)
  }

  async exists(key: string): Promise<number> {
    return await this.client.exists(key)
  }

  async expire(key: string, seconds: number): Promise<boolean> {
    return await this.client.expire(key, seconds)
  }

  async hSet(key: string, field: string, value: string): Promise<number> {
    return await this.client.hSet(key, field, value)
  }

  async hGet(key: string, field: string): Promise<string | undefined> {
    return await this.client.hGet(key, field)
  }

  async hGetAll(key: string): Promise<Record<string, string>> {
    return await this.client.hGetAll(key)
  }

  async hDel(key: string, field: string): Promise<number> {
    return await this.client.hDel(key, field)
  }

  async lPush(key: string, ...values: string[]): Promise<number> {
    return await this.client.lPush(key, values)
  }

  async rPop(key: string): Promise<string | null> {
    return await this.client.rPop(key)
  }

  async lLen(key: string): Promise<number> {
    return await this.client.lLen(key)
  }
}

export const redisService = new RedisService(redisClient!)
