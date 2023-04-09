import { Context, Middleware } from "../../deps.ts";
import { ServiceContext } from "../../mod.ts";

// Define middleware to validate that user exists
const middlewareDbExist = (
  modelName: string,
  {
    message,
    varKey,
  }: {
    message?: string;
    varKey?: string;
  } = {},
) => {
  const middleware: Middleware = async (
    ctx: Context,
    next: any,
  ) => {
    const { logger, db } = ctx.app.state as ServiceContext;
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
