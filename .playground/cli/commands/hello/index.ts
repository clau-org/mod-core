import { CliContext, defineCommand, defineFlag } from "../../deps.ts";
import subcommandWorld from "./world.ts";

const name = defineFlag({
  key: "-n --name",
  description: "name flag",
  required: true,
});

const lastname = defineFlag({
  key: "-l --lastaname",
  description: "lastaname flag",
});

export default defineCommand({
  key: "hello",
  description: "hello command",
  flags: [name, lastname],
  subcommands: [subcommandWorld],
  action: (ctx: CliContext) => {
    const { logger, program } = ctx;
    logger.info("hello action", {
      flags: [
        program.name,
        program.lastaname,
      ],
    });
  },
});
