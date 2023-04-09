import {
  Middleware,
  middlewareDbExist,
  middlewareRequestData,
  schemaIds,
  ServiceContext,
  ServiceRoute,
  z,
} from "../deps.ts";
import { schemaCreate } from "./create.ts";

export const schemaUpdate = z.object({ ...schemaIds }).merge(
  schemaCreate.partial(),
);

const validateUpdateRequest = middlewareRequestData(schemaUpdate);

const validateExist = middlewareDbExist("users", { varKey: "user" });

const handler: Middleware = async (ctx) => {
  const { logger, db } = ctx.app.state as ServiceContext;
  let { user } = ctx.state;
  const { id, uuid, ...userData } = ctx.state.requestData;

  if (user) {
    user = await db.users.update({
      where: { id: user.id },
      data: { ...userData },
    });
    logger.debug("[/users/update]", "users updated");
  }

  ctx.response.body = { data: { user } };
};

const route = new ServiceRoute("/update");

route.addMiddleware(validateUpdateRequest);
route.addMiddleware(validateExist);
route.setHandler(handler);

export { route };
