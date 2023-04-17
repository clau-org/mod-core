// import { defineEventHandler, defineService } from "https://raw.githubusercontent.com/clau-org/mod-core/VERSION/svc/mod.ts";
import { defineEventHandler, defineService } from "../../svc/mod.ts";

const hello = defineEventHandler({
  path: "/",
  handler: (ctx) => {
    const { config, event, logger } = ctx;

    logger.log("hello from route");
    return {
      data: {
        config,
        event,
      },
      message: "hello",
    };
  },
});

const service = await defineService({
  eventHandlers: [hello],
});

await service.listen();
