import {
  Middleware,
  middlewareDbExist,
  middlewareRequestData,
  schemaIds,
  ServiceContext,
  ServiceRoute,
  z,
} from "../deps.ts";

export const schemaDelete = z.object({ ...schemaIds });

const validateDeleteRequest = middlewareRequestData(schemaDelete);

const validateExist = middlewareDbExist("users", { varKey: "user" });

const handler: Middleware = async (ctx) => {
  const { logger, db } = ctx.app.state as ServiceContext;
  let { user } = ctx.state;

  if (user) {
    user = await db.users.delete({
      where: { id: user.id },
    });
    logger.debug("[/users/delete]", "user deleted");
  }

  ctx.response.body = { data: { user } };
};

const route = new ServiceRoute("/delete");

route.addMiddleware(validateDeleteRequest);
route.addMiddleware(validateExist);
route.setHandler(handler);

export { route };
