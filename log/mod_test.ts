import { Logger, LogLevels } from "./mod.ts";

Deno.test("LOG MOD", () => {
  const logger = new Logger();

  logger.debug("some");
  logger.log("some");
  logger.info("some");
  logger.warn("some");
  logger.error("some");
  logger.critical("[some]", 1, {
    some: "some",
  });

  logger.prefix = "clau";
  logger.level = LogLevels.INFO;
  logger.stringify = true;
  logger.datetime = true;

  logger.debug("some");
  logger.log("some");
  logger.info("some");
  logger.warn("some");
  logger.error("some");
  logger.critical("[some]", 1, {
    some: "some",
  });
});
