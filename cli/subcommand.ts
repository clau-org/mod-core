import { Action, CliContext } from "./cli.ts";

export interface Subcommand {
  key: string;
  description: string;
  action: Action;
}

export interface defineSubcommandOptions {
  key: string;
  description?: string;
  action: Action;
}

export const defineSubcommand = (
  options: defineSubcommandOptions,
): Subcommand => {
  const { key, description, action } = options;
  return {
    key,
    description: description ?? key,
    action,
  };
};
