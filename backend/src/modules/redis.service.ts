import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private client: Redis;

  private logger = console;

  constructor() {
    const redisUrl = process.env.REDIS_URL;

    if (!redisUrl) {
      this.logger.warn('REDIS_URL not set, falling back to localhost:6379');
    }

    const url = redisUrl || 'redis://localhost:6379';

    // Log masked URL for debugging
    const sanitizedUrl = url.replace(/(:[^:@]*@)/, ':***@');
    this.logger.log(`[Redis] Initializing client with URL: ${sanitizedUrl}`);
    this.logger.log(`[Redis] Using provided REDIS_URL: ${!!redisUrl}`);

    this.client = new Redis(url, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        const delay = Math.min(times * 1000, 3000);
        this.logger.log(`[Redis] Retrying connection... Attempt ${times}. Delay: ${delay}ms`);
        return delay;
      },
      reconnectOnError: (err) => {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
          return true;
        }
        return false;
      },
    });

    this.client.on('error', (err) => {
      this.logger.error(`[Redis] Connection error: ${err.message}`);
      if (err.stack) {
        this.logger.error(err.stack);
      }
    });

    this.client.on('connect', () => {
      this.logger.log('[Redis] Successfully connected');
    });

    this.client.on('ready', () => {
      this.logger.log('[Redis] Client is ready');
    });
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<'OK'> {
    if (ttlSeconds) {
      return this.client.setex(key, ttlSeconds, value);
    }
    return this.client.set(key, value);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  async exists(key: string): Promise<number> {
    return this.client.exists(key);
  }

  async expire(key: string, ttlSeconds: number): Promise<number> {
    return this.client.expire(key, ttlSeconds);
  }

  getClient(): Redis {
    return this.client;
  }
}