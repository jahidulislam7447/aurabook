import { RedisClientType } from 'redis';
export declare function connectRedis(): Promise<RedisClientType>;
export declare function getRedisClient(): RedisClientType;
export declare function disconnectRedis(): Promise<void>;
export declare class RedisService {
    private client;
    constructor(client: RedisClientType);
    set(key: string, value: string, expireInSeconds?: number): Promise<void>;
    get(key: string): Promise<string | null>;
    del(key: string): Promise<number>;
    exists(key: string): Promise<number>;
    expire(key: string, seconds: number): Promise<boolean>;
    hSet(key: string, field: string, value: string): Promise<number>;
    hGet(key: string, field: string): Promise<string | undefined>;
    hGetAll(key: string): Promise<Record<string, string>>;
    hDel(key: string, field: string): Promise<number>;
    lPush(key: string, ...values: string[]): Promise<number>;
    rPop(key: string): Promise<string | null>;
    lLen(key: string): Promise<number>;
}
export declare const redisService: RedisService;
