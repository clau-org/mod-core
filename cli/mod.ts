import { Config, type ConfigOptions, Denomander, Logger } from "./deps.ts";

export interface CliCommandFlag {
  key: string;
  description?: string;
  required?: boolean;
}

export interface CliCommandOptions {
  description?: string;
  flags?: CliCommandFlag[];
  action?: Function;
}

export class CliCommand {
  key: string;
  description: string;
  flags?: CliCommandFlag[];
  action: Function;
  logger?: Logger;
  config?: Config;
  program?: Denomander;

  constructor(key: string, options?: CliCommandOptions) {
    const { description, flags, action } = options ?? {};
    this.key = key;
    this.description = description ?? key;
    this.flags = flags;

    this.action = () => {
      this.logger?.info("empty action");
    };

    if (action) this.action = action;
  }

  addFlag(flag: CliCommandFlag) {
    if (!this.flags) this.flags = [];
    this.flags?.push(flag);
  }

  setAction(action: Function) {
    this.action = action;
  }
}

export interface CliOptions extends ConfigOptions {
  name?: string;
  version?: string;
  description?: string;
}

export interface ActionContext {
  logger: Logger;
  program: Denomander;
  config: Config;
}

export class Cli {
  program: Denomander;
  logger: Logger;
  config: Config;

  constructor(options?: CliOptions) {
    const {
      name = "cli",
      version = "0.0.0",
      description = "cli",

      allowEmptyValues,
      defaultsPath,
      denoJsonPath,
      envPath,
      examplePath,
      restrictEnvAccessTo,
    } = options ?? {};

    this.program = new Denomander({
      app_name: name,
      app_version: version,
      app_description: description,
    });

    this.logger = new Logger({
      prefix: name,
      datetime: true,
      stringify: false,
    });

    this.config = new Config({
      allowEmptyValues,
      defaultsPath,
      denoJsonPath,
      envPath,
      examplePath,
      restrictEnvAccessTo,
    });
  }

  addCommand(command: CliCommand) {
    const { logger } = this;
    let newProgram = this.program;

    command.logger = this.logger;
    command.program = this.program;

    newProgram.command(command.key, command.description);

    for (const flag of command.flags ?? []) {
      const isRequired = flag.required ?? false;

      if (isRequired) {
        newProgram.requiredOption(flag.key, flag.description ?? flag.key);
      } else {
        newProgram.option(flag.key, flag.description ?? flag.key);
      }
    }

    newProgram.action(() => {
      command.action({
        logger: this.logger,
        program: this.program,
        config: this.config,
      } as ActionContext);
    });

    this.program = newProgram;
  }

  async run() {
    const { logger } = this;
    await this.config.setup();
    try {
      logger.debug({ config: this.config });
      this.program.parse(Deno.args);
    } catch (error) {
      logger.error({ error });
    }
  }
}
