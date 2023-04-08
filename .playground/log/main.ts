/*  

// HOW TO IMPORT

// import from own module
import {
  Logger,
  LogLevels,
} from "https://raw.githubusercontent.com/clau-org/mod-core/v0.0.1/log/mod.ts";

// import from main module
import { LOG } from "https://raw.githubusercontent.com/clau-org/mod-core/v0.0.1/mod.ts";
const { Logger, LogLevels } = LOG;

// import locally
import { Logger, LogLevels } from "../../log/mod.ts";

*/

import { Logger, LogLevels } from "../../log/mod.ts";

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
