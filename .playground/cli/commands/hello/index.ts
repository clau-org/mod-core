import { CliContext, defineCommand, defineFlag } from "../../deps.ts";
import subcommandWorld from "./world.ts";

const name = defineFlag({ key: "-n --name", required: true });
const lastname = defineFlag({ key: "-l --lastname" });

export default defineCommand({
  key: "hello",
  flags: [name, lastname],
  subcommands: [subcommandWorld],
  action: (ctx: CliContext) => {
    const { logger, program } = ctx;
    const { name, lastname } = program;
    logger.info("hello action", { name, lastname });
  },
});
