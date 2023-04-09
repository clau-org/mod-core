import { Config, Logger } from "../../utils/mod.ts";

const logger = new Logger();

const config = new Config();

logger.log({
  config,
});
