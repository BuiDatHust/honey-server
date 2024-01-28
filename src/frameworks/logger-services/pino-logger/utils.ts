import pino, { Level } from 'pino'
import { Options } from 'pino-http'

export function loggerOptions(
  environment: string,
  level: Level = 'debug',
  context?: string,
): Options {
  const isLocal = environment === 'local'
  if (!['fatal', 'error', 'warn', 'info', 'debug', 'trace'].includes(level)) {
    level = 'debug'
  }

  return {
    logger: pino({
      formatters: {
        level: label => {
          return { level: label }
        },
        log(object): Record<string, unknown> {
          if (Object.keys(object).length) {
            if (object['err'] && object['err'] instanceof Error) {
              return {
                app: context,
                data: {
                  ...object,
                  ...pino.stdSerializers.err(object['err']),
                },
              }
            }

            return {
              app: context,
              data: object,
            }
          }
          return {}
        },
      },
      // serializers: {
      //   err: (error: Error) => {
      //     return {
      //       message: error.message,
      //       stack: error.stack,
      //       raw: error,
      //     }
      //   },
      // },
      base: undefined,
      timestamp: isLocal ? () => `,"time": "${new Date(Date.now()).toISOString()}"` : undefined,
      transport: isLocal
        ? {
            target: 'pino-pretty',
            options: {
              colorize: isLocal,
              ignore: 'pid,hostname',
              singleLine: true,
            },
          }
        : undefined,
      level: level,
    }),
    autoLogging: false,
    serializers: {
      req: req => ({
        method: req.method,
        url: req.url,
      }),
      err: pino.stdSerializers.err,
    },
  }
}
