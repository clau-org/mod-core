import { Middleware } from "../deps.ts";

const middlewareError: Middleware = async (ctx, next) => {
  const { logger } = ctx.app.state;
  try {
    await next();
  } catch (error) {
    logger.critical("[middleware: errorHandler]", { error });
    ctx.response.status = error.status || 500;
    ctx.response.body = {
      error,
      message: error.message,
      stack: error.stack,
    };
  }
};

export { middlewareError };
