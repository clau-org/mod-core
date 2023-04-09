import {
  Middleware,
  middlewareDbExist,
  middlewareRequestData,
  schemaIds,
  schemaPage,
  ServiceContext,
  ServiceRoute,
  z,
} from "../deps.ts";

const validateReadRequest = middlewareRequestData(z.object({
  ...schemaIds,
  ...schemaPage,
}));

const validateExist = middlewareDbExist("users", { varKey: "user" });

const handler: Middleware = async (ctx) => {
  const { logger, db } = ctx.app.state as ServiceContext;
  const { user } = ctx.state;
  const { page = 1, pageSize = 12 } = ctx.state.requestData;

  let users: any[] = [];
  let maxPage = 0;

  if (!user) {
    // If user not requested, get all users
    const skip = (page - 1) * pageSize;
    users = await db.users.findMany({ skip, take: pageSize });
    maxPage = Math.ceil((await db.users.count()) / pageSize);
    logger.debug("[/users/read]", "users readed");
  }

  ctx.response.body = {
    data: { user, users, maxPage },
  };
};

const route = new ServiceRoute("/read");

route.addMiddleware(validateReadRequest);
route.addMiddleware(validateExist);
route.setHandler(handler);

export { route };
