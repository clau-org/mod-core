import { loadConfig, LogLevels } from "./deps.ts";

export interface CommandLineInterfaceConfigOptions {
  name?: string;
  description?: string;
  version?: string;
  environment?: string;
  logLevel?: LogLevels;
}

export const defaultCliConfig = {
  name: "cli",
  description: "cli",
  version: "0.0.0",
  environment: "stage",
  logLevel: 0,
};

export class CommandLineInterfaceConfig {
  options: CommandLineInterfaceConfigOptions;
  name: string;
  description: string;
  version: string;
  environment: string;
  logLevel?: LogLevels;

  constructor(options?: CommandLineInterfaceConfigOptions) {
    const {
      name = defaultCliConfig.name,
      description = defaultCliConfig.description,
      version = defaultCliConfig.version,
      environment = defaultCliConfig.environment,
      logLevel = defaultCliConfig.logLevel,
    } = options ?? {};
    this.name = name;
    this.description = description;
    this.version = version;
    this.environment = environment;
    this.logLevel = logLevel;
    this.options = options ?? {};
  }

  async load() {
    const { options } = this;
    // options > env > denojson
    const { denojson, env } = await loadConfig();

    // options > env > denojson
    this.name = options.name ?? env.NAME ?? denojson.name ??
      defaultCliConfig.name;

    this.description = options.description ?? env.DESCRIPTION ??
      denojson.description ??
      defaultCliConfig.description;

    this.version = options.version ?? env.VERSION ?? denojson.version ??
      defaultCliConfig.version;

    this.environment = options.environment ?? env.ENVIRONMENT ??
      denojson.environment ?? defaultCliConfig.environment;

    this.logLevel = options.logLevel ??
      parseInt(
        env.LOG_LEVEL ?? denojson.logLevel ??
          defaultCliConfig.logLevel,
      );
  }
}
