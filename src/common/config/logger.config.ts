import type { Params } from 'nestjs-pino';
import type { Request } from 'express';

export const pinoConfig = (): Params => ({
  pinoHttp: {
    name: 'Hello Identity',
    transport: {
      target: 'pino-pretty',
      options: {
        singleLine: true,
        colorize: true,
        levelFirst: true,
        autoLogging: false,
        translateTime: 'yyyy-mm-dd, HH:MM:ss',
      },
    },
    serializers: {
      req: (request: Request) => ({
        id: request.id,
        method: request.method,
        url: request.url,
        params: request.params,
        headers: request.headers,
      }),
    },
  },
});
