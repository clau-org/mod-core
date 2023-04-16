import { load, Logger, LogLevels } from "./deps.ts";

export const DEFAULT_DENO_JSON_PATH = "./deno.json";
export const DEFAULT_ENV_PATH = "./.env";

export interface ConfigOptions {
  files?: {
    denoPath?: string;
    envPath?: string;
  };
  logger?: Logger;
  [key: string]: any;
  name?: string;
  version?: string;
  env?: string;
  logLevel?: string;
}

export class Config {
  // Basic
  name: string;
  version: string;
  env: string;

  // Log
  logger: Logger;
  logLevel: LogLevels;
  logLevelKey: string;

  // Files
  files: {
    deno: {
      path: string;
      content?: any;
    };
    env: {
      path: string;
      content?: any;
    };
  };

  // Custom data
  [key: string]: any;

  constructor(options?: ConfigOptions) {
    const {
      // Basic
      name = "",
      version = "0.0.0",
      env = "test",

      // Log
      logLevelKey = "INFO",
      logger,

      // Files
      files: {
        denoPath = DEFAULT_DENO_JSON_PATH,
        envPath = DEFAULT_ENV_PATH,
      } = {},

      // Custom data
      ...customData
    } = options ?? {};

    // Basic
    this.name = name;
    this.version = version;
    this.env = env;

    // Log
    this.logLevel = LogLevels[logLevelKey] as any;
    this.logLevelKey = logLevelKey;

    if (logger) {
      this.logger = logger;
      this.logger.level = this.logLevel!;
    } else {
      this.logger = new Logger({ prefix: name, level: this.logLevel });
    }

    // Files
    this.files = {
      deno: {
        path: denoPath,
      },
      env: {
        path: envPath,
      },
    };

    // Custom data
    Object.entries(customData).forEach(([key, value]) => this[key] = value);
  }

  async setup() {
    // Read deno.json
    try {
      this.files.deno.content = JSON.parse(
        await Deno.readTextFile(this.files.deno.path),
      );
    } catch (_e) {}

    // Read .env
    try {
      this.files.env.content = await load({ envPath: this.files.env.path });
      delete this.files.deno.content.tasks;
      delete this.files.deno.content.fmt;
    } catch (_e) {}

    // Merge deno.json and .env
    const config = { ...this.files.deno.content, ...this.files.env.content };

    // Merge config instance with config data
    Object.entries(config).forEach(([key, value]) => this[key] = value);

    // Basic
    this.name = this.NAME ?? this.name;
    this.version = this.VERSION ?? this.version;
    this.env = this.ENV ?? this.env;

    // Log
    this.logLevelKey = this.LOG_LEVEL ?? this.logLevelKey;
    this.logLevel = LogLevels[this.logLevelKey as any] as any;
    this.logger.level = this.logLevel!;

    return this;
  }
}

export const setupConfig = async () => await new Config().setup();
