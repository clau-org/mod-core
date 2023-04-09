import {
  Middleware,
  middlewareRequestData,
  ServiceContext,
  ServiceRoute,
  z,
} from "../deps.ts";

export const schemaCreate = z.object({
  email: z.string().email(),
}).strict();

const validateCreateRequest = middlewareRequestData(schemaCreate);

const handler: Middleware = async (ctx) => {
  const { logger, db } = ctx.app.state as ServiceContext;
  const data = ctx.state.requestData;

  const user = await db.users.create({ data });
  logger.debug("[/users/create]", "user created");
  ctx.response.body = { data: { user } };
};

const route = new ServiceRoute("/create");
route.addMiddleware(validateCreateRequest);
route.setHandler(handler);

export { route };
