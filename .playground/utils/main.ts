import { logger, setupConfig } from "../../utils/mod.ts";

const config = await setupConfig();

logger.log({ config });