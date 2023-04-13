import { Context, Middleware } from "../../deps.ts";
import { DefaultServiceState } from "../../mod.ts";

// Define middleware to validate that user exists
const middlewareDbUnique = (
  modelName: string,
  keyName: string,
  {
    message,
    varDb,
    varRequest,
    varDbField,
  }: {
    message?: string;
    varDb?: string;
    varRequest?: string;
    varDbField?: string;
  } = {},
) => {
  const middleware: Middleware = async (
    ctx: Context,
    next: any,
  ) => {
    const { logger } = ctx.app.state as DefaultServiceState;
    const db = ctx.app.state[ varDb ?? 'db' ]
    const model = db![modelName]
    const keyRequest = varRequest ?? keyName
    const keyDb = varDbField ?? keyName
    const keyRequestData = ctx.state.requestData[keyRequest]

    const document = await model.findFirst({
      where: {
        [`${keyDb}`]:keyRequestData,
      },
    });

    const documentIsNotUnique = document;

    if (documentIsNotUnique) {
      ctx.response.status = 404;
      ctx.response.body = {
        data: {
          keyRequest,
          keyDb,
          keyRequestData,
        },
        message: message ?? `Document is not unique.`
      };
      logger.debug('[middleware: validateExist]','[Document is not unique]');
      return;
    }

    logger.debug('[middleware: validateExist]','[Document is unique]');

    await next();
  };
  return middleware;
};

export { middlewareDbUnique };
