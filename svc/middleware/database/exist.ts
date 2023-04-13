import { Context, Middleware } from "../../deps.ts";
import { DefaultServiceState } from "../../mod.ts";

// Define middleware to validate that user exists
const middlewareDbExist = (
  modelName: string,
  {
    message,
    varKey,
    varDb,
  }: {
    message?: string;
    varKey?: string;
    varDb?: string;
  } = {},
) => {
  const middleware: Middleware = async (
    ctx: Context,
    next: any,
  ) => {
    const { logger } = ctx.app.state as DefaultServiceState;
    const db = ctx.app.state[ varDb ?? 'db' ]
    const model = db![modelName]
    const { uuid, id } = ctx.state.requestData;

    const document = await model.findFirst({
      where: {
        OR: [{ uuid }, { id }],
      },
    });

    const documentDoesntExist = !document;
    const isExpected = id || uuid;

    if (documentDoesntExist && isExpected) {
      ctx.response.status = 404;
      ctx.response.body = {
        message: message ?? `${modelName} doesn't exist.`,
        uuid,
        id,
      };
      logger.debug(`[middleware: validateExist][${modelName} doesn't exist]`);
      return;
    }

    ctx.state[varKey ?? modelName] = document;
    logger.debug(`[middleware: validateExist][${modelName} exists]`);

    await next();
  };
  return middleware;
};

export { middlewareDbExist };
