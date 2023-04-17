import { CliContext, defineSubcommand } from "../../deps.ts";

export default defineSubcommand({
  key: "world",
  description: "world subcommand",
  action: (ctx: CliContext) => {
    const { logger, program } = ctx;
    logger.info("world sub action", {
      flags: [
        program.name,
        program.lastaname,
      ],
    });
  },
});
