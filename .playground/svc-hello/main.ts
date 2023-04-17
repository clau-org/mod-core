import { defineServiceHandler } from "https://raw.githubusercontent.com/clau-org/mod-core/cleanup/svc/mod.ts";
import z from "https://deno.land/x/zod@v3.21.4/index.ts";

const service = await defineServiceHandler({
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
});

export { service };
