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
    this.logger.log(`Initializing Redis client with URL: ${sanitizedUrl}`);

    this.client = new Redis(url, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      // Prevent crash on connection error
      reconnectOnError: (err) => {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
          return true;
        }
        return false;
      },
    });

    this.client.on('error', (err) => {
      this.logger.error(`Redis connection error: ${err.message}`);
      // Cleanly handle error to prevent unhandled rejection crashes
    });

    this.client.on('connect', () => {
      this.logger.log('Successfully connected to Redis');
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