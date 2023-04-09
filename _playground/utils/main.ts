import { Config, Logger } from "../../utils/mod.ts";

const logger = new Logger();

const config = new Config();

await config.setup();

logger.log({
  config,
});
