import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

export const redisConfig = (): CacheModuleAsyncOptions => ({
  useFactory: async () => ({
    store: await redisStore({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
      ttl: 600,
    }),
  }),
  isGlobal: true,
});
