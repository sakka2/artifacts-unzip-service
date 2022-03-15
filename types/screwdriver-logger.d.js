// Type definitions for winston 3.0
// Project: https://github.com/winstonjs/winston

declare module 'screwdriver-logger' {
    import * as winston from 'winston';

    interface ExceptionHandler extends winston.ExceptionHandler {}
    interface Logger extends winston.Logger {}
    interface RejectionHandler extends winston.RejectionHandler {}
    interface QueryOptions extends winston.QueryOptions {}
    interface Profiler extends winston.Profiler {}
    type LogCallback = (error?: any, level?: string, message?: string, meta?: any) => void;
    interface LogEntry extends winston.LogEntry {}
    interface LogMethod extends winston.LogMethod {}
    interface LeveledLogMethod extends winston.LeveledLogMethod {}
    interface LoggerOptions extends winston.LoggerOptions {}
    interface Logger extends winston.Logger {}
    interface Container extends winston.Container {}

    let version: string;
    let ExceptionHandler: ExceptionHandler;
    let RejectionHandler: RejectionHandler;
    let Container: Container;
    let loggers: Container;

    let addColors: (target: Config.AbstractConfigSetColors) => any;
    let createLogger: (options?: LoggerOptions) => Logger;

    let error: LeveledLogMethod;
    let warn: LeveledLogMethod;
    let info: LeveledLogMethod;
    let http: LeveledLogMethod;
    let verbose: LeveledLogMethod;
    let debug: LeveledLogMethod;
    let silly: LeveledLogMethod;

    let log: LogMethod;
    let query: (options?: QueryOptions, callback?: (err: Error, results: any) => void) => any;
    let stream: (options?: any) => NodeJS.ReadableStream;
    let add: (transport: Transport) => Logger;
    let remove: (transport: Transport) => Logger;
    let clear: () => Logger;
    let startTimer: () => Profiler;
    let profile: (id: string | number) => Logger;
    let configure: (options: LoggerOptions) => void;
    let child: (options: Object) => Logger;
    let level: string;
    let exceptions: ExceptionHandler;
    let rejections: RejectionHandler;
    let exitOnError: Function | boolean;
    // let default: object;
}
