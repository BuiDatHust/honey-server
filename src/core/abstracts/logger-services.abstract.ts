export abstract class ILoggerService {
  abstract trace(msg: string, ...args: any[]): void
  abstract debug(msg: string, ...args: any[]): void
  abstract debug(obj: unknown, msg?: string, ...args: any[]): void
  abstract info(msg: string, ...args: any[]): void
  abstract info(obj: unknown, msg?: string, ...args: any[]): void
  abstract warn(msg: string, ...args: any[]): void
  abstract warn(obj: unknown, msg?: string, ...args: any[]): void
  abstract error(msg: string, ...args: any[]): void
  abstract error(obj: unknown, msg?: string, ...args: any[]): void
  abstract fatal(msg: string, ...args: any[]): void
  abstract fatal(obj: unknown, msg?: string, ...args: any[]): void
  abstract setContext(value: string): void
}
