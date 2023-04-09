import { ActionContext, Cli, CliCommand } from "../../cli/mod.ts";

const cli = new Cli();

const command1 = new CliCommand("command1");

command1.addFlag({
  key: "-s --some",
  description: "some description",
  required: true,
});

command1.setAction((ctx: ActionContext) => {
  const { logger, program } = ctx;

  logger.info("action", program.some);
});

const command2 = new CliCommand("command2", {
  action: (ctx: ActionContext) => {
    const { logger, program } = ctx;

    logger.info("action2", program.some);
  },
  flags: [
    {
      key: "-s --some",
      description: "some description",
      required: true,
    },
  ],
});

cli.addCommand(command1);
cli.addCommand(command2);

cli.run();
