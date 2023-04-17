import {
  CliContext,
  defineCommand,
  defineCommandLineInterface,
  defineFlag,
  defineSubcommand,
} from "../../cli/mod.ts";

const subcommand = defineSubcommand({
  key: "some",
  description: "some subcommand",
  action: (ctx: CliContext) => {
    const { config, logger, program } = ctx;
    logger.info("some sub action", {
      config,
      flags: [
        program.flag,
        program.flagtwo,
      ],
    });
  },
});

const command = defineCommand({
  key: "some",
  description: "some command",
  flags: [
    defineFlag({
      key: "-f --flag",
      description: "some flag",
      required: true,
    }),
    defineFlag({
      key: "-p --flagtwo",
      description: "some other flag",
    }),
  ],
  subcommands: [
    subcommand,
  ],
  action: (ctx: CliContext) => {
    const { config, logger, program } = ctx;
    logger.info("some action", {
      config,
      flags: [
        program.flag,
        program.flagtwo,
      ],
    });
  },
});

const program = await defineCommandLineInterface({ commands: [command] });

program.run();
