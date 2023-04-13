import { DefaultServiceState, Middleware, ServiceRoute, z, middlewareDbUnique } from "../deps.ts";

export const schema = z.object({
  email: z.string().email(),
}).strict();

export const validateUnique = middlewareDbUnique("users","email");

export const handler: Middleware = async (ctx) => {
  const { logger, db } = ctx.app.state as DefaultServiceState;
  const data = ctx.state.requestData;

  const user = await db.users.create({ data });
  logger.debug("[/users/create]", "user created");
  ctx.response.body = { data: { user } };
};

export const route = new ServiceRoute("/users/create", { schema, handler, middlewares: [validateUnique] });
