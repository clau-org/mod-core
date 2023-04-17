import { getQuery, Schema, ZodError } from "../deps.ts";
import { defineMiddleware } from "./middleware.ts";

function middlewareGetEvent(schema?: Schema) {
  const middleware = defineMiddleware(async (_ctx, next) => {
    const { logger, ctx } = _ctx;

    try {
      // Get request body and query parameters
      let body = await ctx.request.body().value;
      const bodyUrl = Object.fromEntries(body?.entries?.() || []);
      const query = getQuery(ctx);

      // Combine body, bodyUrl, and query parameters into a single object
      const data = { ...body, ...bodyUrl, ...query };

      logger.debug("[middlewareGetEvent]", "before validation", { data });
      if (schema) schema.parse(data);
      logger.debug("[middlewareGetEvent]", "after validation", { data });

      ctx.state.event = data;

      await next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.error("[middlewareGetEvent]", "validation error", { error });
        ctx.response.status = 400;
        ctx.response.body = { error };
      } else throw error;
    }
  });
  return middleware;
}

// Export the validate function
export { middlewareGetEvent };
