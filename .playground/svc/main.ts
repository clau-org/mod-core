import {
  Service,
  ServiceState,
  ServiceRoute,
  ServiceRouter,
} from "../../svc/mod.ts";

const service = new Service();

const serviceRouter = new ServiceRouter();

const serviceRoute = new ServiceRoute("/");
serviceRoute.setHandler((ctx) => {
  const { logger, config } = ctx.app.state as ServiceState;
  const { requestData } = ctx.state;

  config.setup();

  logger.debug("hello");

  ctx.response.body = {
    message: "hello",
    requestData,
    config,
  };
});

serviceRouter.addRoute(serviceRoute);
service.addRouter(serviceRouter);

export { service };
