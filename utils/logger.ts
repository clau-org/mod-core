// Import Colors module from the deno standard library and define the ILogger interface
import { Colors } from "./deps.ts";

interface LoggerInterface {
  debug(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
}

export interface loggerOptions {
  prefix?: string;
  level?: LogLevels;
  stringify?: boolean;
  datetime?: boolean;
}

export enum LogLevels {
  DEBUG = 0,
  LOG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  CRITICAL = 5,
}

// Define the Logger class that implements the ILogger interface
export class Logger implements LoggerInterface {
  prefix: string;
  level: number;
  stringify?: boolean;
  datetime?: boolean;

  // Initialize the logger with a prefix and optional log level
  constructor(options?: loggerOptions) {
    const {
      prefix = "",
      level = LogLevels.DEBUG,
      stringify = false,
      datetime = true,
    } = options ?? {};

    this.prefix = prefix;
    this.level = level;
    this.stringify = stringify;
    this.datetime = datetime;
  }

  // Log a message with the given level and arguments
  private _log(level: LogLevels, ...args: any[]) {
    const colorsByLog = new Map();
    colorsByLog.set(LogLevels.DEBUG, Colors.blue);
    colorsByLog.set(LogLevels.LOG, Colors.cyan);
    colorsByLog.set(LogLevels.INFO, Colors.green);
    colorsByLog.set(LogLevels.WARN, Colors.yellow);
    colorsByLog.set(LogLevels.ERROR, Colors.red);
    colorsByLog.set(LogLevels.CRITICAL, Colors.brightRed);

    // Format the log message with colors and time, level, and prefix labels
    const now = new Date();
    let LOG_TIME = `[${now.toISOString()}] `;
    LOG_TIME = Colors.gray(LOG_TIME);
    LOG_TIME = Colors.italic(LOG_TIME);

    let LOG_LEVEL = LogLevels[level];
    LOG_LEVEL = colorsByLog.get(level)(LOG_LEVEL);
    LOG_LEVEL = Colors.bold(LOG_LEVEL);
    LOG_LEVEL = `[${LOG_LEVEL}]`;

    let LOG_PREFIX = "";
    if (this.prefix) {
      LOG_PREFIX = this.prefix.toUpperCase();
      LOG_PREFIX = Colors.bold(LOG_PREFIX);
      LOG_PREFIX = Colors.bgBlack(LOG_PREFIX);
      LOG_PREFIX = `[${LOG_PREFIX}] `;
    }

    // Apply formatting to each argument
    let logArgs = args.map((arg) => {
      const parse = this.stringify && typeof arg === "object" && arg !== null;
      if (parse) {
        try {
          return JSON.stringify(arg, null, 2);
        } catch (e) {
          return arg;
        }
      } else if (
        typeof arg === "string" &&
        arg.startsWith("[") &&
        arg.endsWith("]")
      ) {
        let txt: any = arg.slice(1, -1);
        txt = Colors.underline(txt);
        txt = Colors.bold(txt);
        return `[${txt}]`;
      }
      return arg;
    });

    const logMessage = `${this.datetime ? LOG_TIME : ""}${
      this.prefix ? LOG_PREFIX : ""
    }${LOG_LEVEL}`;

    // Print the formatted log message to the console
    console.log(logMessage, ...logArgs);
  }

  // Check if a log level should be logged
  private shouldLog(level: LogLevels) {
    return level >= this.level;
  }

  debug(...args: any[]) {
    if (!this.shouldLog(LogLevels.DEBUG)) return;
    this._log(LogLevels.DEBUG, ...args);
  }

  info(...args: any[]) {
    if (!this.shouldLog(LogLevels.INFO)) return;
    this._log(LogLevels.INFO, ...args);
  }

  log(...args: any[]) {
    if (!this.shouldLog(LogLevels.LOG)) return;
    this._log(LogLevels.LOG, ...args);
  }

  warn(...args: any[]) {
    if (!this.shouldLog(LogLevels.WARN)) return;
    this._log(LogLevels.WARN, ...args);
  }

  error(...args: any[]) {
    if (!this.shouldLog(LogLevels.ERROR)) return;
    this._log(LogLevels.ERROR, ...args);
  }

  critical(...args: any[]) {
    this._log(LogLevels.CRITICAL, ...args);
  }
}

export const logger = new Logger();
