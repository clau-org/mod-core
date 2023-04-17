import {
  CommandLineInterfaceConfig,
  CommandLineInterfaceConfigOptions,
} from "./config.ts";
import { Denomander, Logger, LogLevels, Option } from "./deps.ts";
import { Command } from "./command.ts";

export interface CliContext {
  logger: Logger;
  config: CommandLineInterfaceConfig;
  program: Denomander;
}

export interface Action {
  (ctx: CliContext): void | Promise<void>;
}
export interface defineCommandLineInterfaceOptions
  extends CommandLineInterfaceConfigOptions {
  commands: any[];
}

export async function defineCommandLineInterface(
  options: defineCommandLineInterfaceOptions,
) {
  let {
    name,
    version,
    environment,
    logLevel = LogLevels.INFO,
    description,
    commands,
  } = options;

  // Config
  const config = new CommandLineInterfaceConfig({
    name,
    version,
    environment,
    logLevel,
    description,
  });
  await config.load();

  // Logger
  const logger = new Logger({ prefix: config.name, level: config.logLevel });

  logger.debug("[defineCommandLineInterface]", "configuration loaded");

  const program = new Denomander({
    app_name: config.name,
    app_version: config.version,
    app_description: config.description,
  });

  // Create run function
  const run = async (args?: any) => {
    commands.forEach((command) =>
      addCommand({ command, config, logger, program })
    );
    try {
      program.parse(args ?? Deno.args);
    } catch (error) {
      logger.error({ error });
    }
  };

  return {
    config,
    program,
    run,
  };
}

export function addCommand(
  {
    program,
    command,
    logger,
    config,
  }: {
    program: Denomander;
    command: Command;
    config: CommandLineInterfaceConfig;
    logger: Logger;
  },
) {
  // Set command key and description
  program.command(command.key, command.description);

  // Set command flags
  command.flags?.forEach((flag) => {
    const isRequired = flag.required ?? false;
    if (isRequired) {
      program.requiredOption(flag.key, flag.description ?? flag.key);
    } else {
      program.option(flag.key, flag.description ?? flag.key);
    }
  });

  // Set command action
  program.action(() => {
    command.action({
      logger: logger,
      program: program,
      config: config,
    });
  });

  // Set subcommands
  command.subcommands?.forEach((subcommand) => {
    const parent = program.command(subcommand.key);

    parent.subCommand(subcommand.key)
      .description(subcommand.description)
      .action(() => {
        subcommand.action({
          logger: logger,
          program: program,
          config: config,
        });
      });
  });
}
