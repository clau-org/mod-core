import { defineMiddleware } from "../middleware.ts";

const middlewareDbExist = (
  modelName: string,
  {
    message: customMessage,
    varKey,
  }: {
    message?: string;
    varKey?: string;
  } = {},
) => {
  return defineMiddleware(async (_ctx, next) => {
    const { event, logger, db, ctx } = _ctx;
    const model = db![modelName];
    const { uuid, id } = event;

    const document = await model.findFirst({
      where: { OR: [{ uuid }, { id }] },
    });

    const documentDoesntExist = !document;
    const isExpected = id || uuid;

    if (documentDoesntExist && isExpected) {
      const message = customMessage ?? `${modelName} doesn't exist.`;
      ctx.response.status = 404;
      ctx.response.body = {
        message,
        error: { message, data: { uuid, id } },
      };

      return logger.debug(
        `[middleware: validateExist][${modelName} doesn't exist]`,
      );
    }

    ctx.state.event[varKey ?? modelName] = document;

    logger.debug("[middleware: validateExist]", `[${modelName} exists]`);

    await next();
  });
};

export { middlewareDbExist };
