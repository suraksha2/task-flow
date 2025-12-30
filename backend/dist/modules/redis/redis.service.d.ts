import Redis from 'ioredis';
export declare class RedisService {
    private readonly redis;
    constructor(redis: Redis);
    get(key: string): Promise<string | null>;
    set(key: string, value: string, ttlSeconds?: number): Promise<void>;
    del(key: string): Promise<void>;
    exists(key: string): Promise<boolean>;
    setJson<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
    getJson<T>(key: string): Promise<T | null>;
}
