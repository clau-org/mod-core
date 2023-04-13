import {
  Service,
  ServiceState,
  ServiceRoute,
} from "../../svc/mod.ts";

const service = new Service();

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

service.addRoute(serviceRoute)

// export { service };

service.listen();
