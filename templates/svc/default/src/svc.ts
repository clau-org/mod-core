import {
  Service,
  ServiceRoute,
  ServiceState,
  z,
} from "./deps.ts";

const service = new Service();

const serviceRoute = new ServiceRoute("/");
serviceRoute.setSchema(z.object({
  hello: z.string(),
}));
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

export { service };
