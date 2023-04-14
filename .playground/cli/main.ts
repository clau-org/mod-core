import { ActionContext, Cli, CliCommand } from "../../cli/mod.ts";

const cli = new Cli();

const command = new CliCommand("command");

command.addFlag({
  key: "-f --flag",
  description: "some flag",
  required: true,
});

command.setAction((ctx: ActionContext) => {
  const { logger, program } = ctx;

  logger.info("action", program.some);
});

cli.addCommand(command);

await cli.run();
