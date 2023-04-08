import { Logger } from "../mod.ts";

const logger = new Logger({ prefix: "PLAYGROUND" });
logger.debug("Hello, world!");
logger.info("Hello, world!");
logger.warn("Hello, world!");
logger.error("Hello, world!");
