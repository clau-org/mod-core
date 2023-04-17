import { Denomander, Logger } from "./deps.ts";
import { CommandLineInterfaceConfig } from "./config.ts";
import { Flag } from "./flag.ts";
import { Subcommand } from "./subcommand.ts";
import { Action, CliContext } from "./cli.ts";

export interface Command {
  key: string;
  description: string;
  flags?: Flag[];
  subcommands?: Subcommand[];
  action: Action;
}
export interface defineCommandOptions {
  key: string;
  description?: string;
  flags?: Flag[];
  subcommands?: Subcommand[];
  action: Action;
}

export const defineCommand = (options: defineCommandOptions): Command => {
  const { key, description, action: action, flags, subcommands } = options;
  return {
    key,
    description: description ?? key,
    action,
    flags,
    subcommands,
  };
};
