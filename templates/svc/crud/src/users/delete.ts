import {
  DefaultServiceState,
  Middleware,
  middlewareDbExist,
  middlewareRequestData,
  schemaIds,
  ServiceRoute,
  z,
} from "../deps.ts";

export const schema = z.object({ ...schemaIds });

export const validateExist = middlewareDbExist("users", { varKey: "user" });

export const handler: Middleware = async (ctx) => {
  const { logger, db } = ctx.app.state as DefaultServiceState;
  let { user } = ctx.state;

  if (user) {
    user = await db.users.delete({
      where: { id: user.id },
    });
    logger.debug("[/users/delete]", "user deleted");
  }

  ctx.response.body = { data: { user } };
};

export const route = new ServiceRoute("/users/delete", {
  schema,
  handler,
  middlewares: [validateExist],
});
