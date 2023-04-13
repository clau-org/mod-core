import {
  DefaultServiceState,
  Middleware,
  middlewareDbExist,
  schemaIds,
  schemaPage,
  ServiceRoute,
  z,
} from "../deps.ts";

export const schema = z.object({
  ...schemaIds,
  ...schemaPage,
});

export const validateExist = middlewareDbExist("users", { varKey: "user" });

export const handler: Middleware = async (ctx) => {
  const { logger, db } = ctx.app.state as DefaultServiceState;
  const { user } = ctx.state;
  const { page = 1, pageSize = 12 } = ctx.state.requestData;

  let users: any[] = [];
  let maxPage = 0;

  if (!user) {
    // If user not requested, get all users
    const skip = (page - 1) * pageSize;
    users = await db!.users.findMany({ skip, take: pageSize });
    maxPage = Math.ceil((await db!.users.count()) / pageSize);
    logger.debug("[/users/read]", "users readed");
  }

  ctx.response.body = {
    data: { user, users, maxPage },
  };
};

export const route = new ServiceRoute("/users/read", {
  schema,
  handler,
  middlewares: [validateExist],
});
