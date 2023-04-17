import { loadConfig, LogLevels } from "../deps.ts";

export interface ServiceConfigOptions {
  name?: string;
  version?: string;
  environment?: string;
  port?: number;
  logLevel?: LogLevels;
  routes?: any[];
}

export const defaultServiceConfig = {
  name: "service",
  version: "0.0.0",
  environment: "stage",
  port: 8000,
  logLevel: 0,
  routes: [],
};

export class ServiceConfig {
  options: ServiceConfigOptions;
  name: string;
  version: string;
  environment: string;
  port: number;
  logLevel?: LogLevels;

  constructor(options?: ServiceConfigOptions) {
    const {
      name = defaultServiceConfig.name,
      version = defaultServiceConfig.version,
      environment = defaultServiceConfig.environment,
      port = defaultServiceConfig.port,
      logLevel = defaultServiceConfig.logLevel,
    } = options ?? {};
    this.name = name;
    this.version = version;
    this.environment = environment;
    this.port = port;
    this.logLevel = logLevel;
    this.options = options ?? {};
  }

  async load() {
    const { options } = this;
    // options > env > denojson
    const { denojson, env } = await loadConfig();

    // options > env > denojson
    this.name = options.name ?? env.NAME ?? denojson.name ??
      defaultServiceConfig.name;

    this.version = options.version ?? env.VERSION ?? denojson.version ??
      defaultServiceConfig.version;

    this.environment = options.environment ?? env.ENVIRONMENT ??
      denojson.environment ?? defaultServiceConfig.environment;

    this.port = options.port ??
      parseInt(env.PORT ?? denojson.port ?? defaultServiceConfig.port);

    this.logLevel = options.logLevel ??
      parseInt(
        env.LOG_LEVEL ?? denojson.logLevel ?? defaultServiceConfig.logLevel,
      );
  }
}
