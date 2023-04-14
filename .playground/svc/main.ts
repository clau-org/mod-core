import { DefaultServiceState, Service, ServiceRoute } from "../../svc/mod.ts";

const service = new Service();

const serviceRoute = new ServiceRoute("/");

serviceRoute.setHandler(async (ctx) => {
  const { logger, config } = ctx.app.state as DefaultServiceState;
  const { requestData } = ctx.state;

  await config.setup();

  logger.debug("hello");

  ctx.response.body = { requestData, config };
});

service.addRoute(serviceRoute);

await service.listen();
