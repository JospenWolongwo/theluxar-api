import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

export const redisConfig = (): CacheModuleAsyncOptions => ({
  useFactory: async () => {
    // Check if REDIS_ENABLED is false, use memory store instead
    if (process.env.REDIS_ENABLED && process.env.REDIS_ENABLED.toLowerCase() === 'false') {
      console.log('Redis is disabled, using in-memory cache');
      return {
        ttl: 600, // Default TTL
      };
    }
    
    // Otherwise use Redis if configured
    try {
      console.log(`Connecting to Redis at ${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`);
      return {
        store: await redisStore({
          socket: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379', 10),
          },
          ttl: 600,
        }),
      };
    } catch (error) {
      console.error('Failed to connect to Redis, falling back to in-memory cache', error);
      return {
        ttl: 600, // Default TTL
      };
    }
  },
  isGlobal: true,
});
