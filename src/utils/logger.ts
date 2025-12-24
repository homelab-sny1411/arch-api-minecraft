import pino from 'pino';
import { config } from '../config/environment';

const isDevelopment = config.api.nodeEnv === 'development';

export const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: isDevelopment
        ? {
              target: 'pino-pretty',
              options: {
                  colorize: true,
                  translateTime: 'SYS:standard',
                  ignore: 'pid,hostname',
              },
          }
        : undefined,
    formatters: {
        level: (label) => {
            return { level: label.toUpperCase() };
        },
    },
});
