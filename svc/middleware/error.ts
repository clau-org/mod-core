import { defineMiddleware } from "./middleware.ts";

const middlewareError = defineMiddleware(async (_ctx, next) => {
  const { logger, ctx } = _ctx;
  try {
    await next();
  } catch (error) {
    logger.critical("[middleware: middlewareError]", { error });
    ctx.response.status = error.status || 500;
    ctx.response.body = {
      error: {
        error,
        message: error.message,
        stack: error.stack,
      },
    };
  }
});

export { middlewareError };
