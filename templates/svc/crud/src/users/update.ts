import {
  DefaultServiceState,
  Middleware,
  middlewareDbExist,
  schemaIds,
  ServiceRoute,
  z,
} from "../deps.ts";
import { schema as schemaCreate } from "./create.ts";

export const schema = z.object({ ...schemaIds }).merge(
  schemaCreate.partial(),
);

export const validateExist = middlewareDbExist("users", { varKey: "user" });

export const handler: Middleware = async (ctx) => {
  const { logger, db } = ctx.app.state as DefaultServiceState;
  let { user } = ctx.state;
  const { id, uuid, ...userData } = ctx.state.requestData;

  if (user) {
    user = await db!.users.update({
      where: { id: user.id },
      data: { ...userData },
    });
    logger.debug("[/users/update]", "users updated");
  }

  ctx.response.body = { data: { user } };
};

export const route = new ServiceRoute("/users/update", {
  schema,
  handler,
  middlewares: [validateExist],
});
