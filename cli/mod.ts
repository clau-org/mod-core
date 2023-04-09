import { Denomander, Logger } from "./deps.ts";

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

export interface CliOptions {
  name?: string;
  version?: string;
  description?: string;
}

export interface ActionContext {
  logger: Logger;
  program: Denomander;
}

export class Cli {
  program: Denomander;
  logger: Logger;

  constructor(options?: CliOptions) {
    const {
      name = "cli",
      version = "0.0.0",
      description = "cli",
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
      } as ActionContext);
    });

    this.program = newProgram;
  }

  run() {
    const { logger } = this;
    try {
      this.program.parse(Deno.args);
    } catch (error) {
      logger.error({ error });
    }
  }
}
