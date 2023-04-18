import { CliContext, defineSubcommand } from "../../deps.ts";

export default defineSubcommand({
  key: "world",
  action: (ctx: CliContext) => {
    const { logger, program } = ctx;
    const { name, lastname } = program;
    logger.info("world sub action", { name, lastname });
  },
});
