import { defineMiddleware } from "../middleware.ts";

const middlewareDbUnique = (
  modelName: string,
  keyName: string,
  {
    message: customMessage,
    varRequest,
    varDbField,
  }: {
    message?: string;
    varRequest?: string;
    varDbField?: string;
  } = {},
) => {
  return defineMiddleware(async (_ctx, next) => {
    const { event, logger, db, ctx } = _ctx;
    const model = db[modelName];
    const keyRequest = varRequest ?? keyName;
    const keyDb = varDbField ?? keyName;
    const keyRequestData = event[keyRequest];
    const isExpectedRequestData = !!keyRequestData;

    const document = await model.findFirst({
      where: { [`${keyDb}`]: keyRequestData },
    });

    const documentIsNotUnique = document;

    if (documentIsNotUnique && isExpectedRequestData) {
      const message = customMessage ?? `Document is not unique.`;
      ctx.response.status = 400;
      ctx.response.body = {
        message,
        error: { message, data: { keyRequest, keyDb, keyRequestData } },
      };
      return logger.debug(
        "[middleware: validateExist]",
        "Document is not unique",
      );
    }

    logger.debug("[middleware: validateExist]", "Document is unique");

    await next();
  });
};

export { middlewareDbUnique };
