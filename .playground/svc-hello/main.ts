import { defineEventHandler, defineService } from "../../svc/mod.ts";
import z from "https://deno.land/x/zod@v3.21.4/index.ts";

const service = await defineService({
  eventHandler: defineEventHandler({
    path: "/",
    schema: z.object({
      message: z.string(),
    }).partial(),
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
  }),
});

service.listen(8000);
