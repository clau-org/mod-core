import { defineEventHandler, z } from "../../deps.ts";
import { ServiceContext } from "../../service.ts";
import middlewareHello from "../../middlewares/hello.ts";

export default defineEventHandler({
  path: "/",
  schema: z.object({
    hello: z.string().nullish(),
  }),
  middlewares: [middlewareHello],
  handler: async (ctx) => {
    const { config, event, logger, db } = ctx as ServiceContext;

    const users = await db.users.findMany();

    logger.log("hello from route", users);
    return {
      data: {
        config,
        event,
        users,
      },
      message: "hello",
    };
  },
});
