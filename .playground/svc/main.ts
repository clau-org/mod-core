import {
  middlewareRequestData,
  Service,
  ServiceContext,
  // ServiceOptions,
  ServiceRouter,
} from "../../svc/mod.ts";

const service = new Service();

const serviceRouter = new ServiceRouter();

serviceRouter.all("/", middlewareRequestData(), (ctx) => {
  const { logger, config } = ctx.app.state as ServiceContext;
  const { requestData } = ctx.state;

  logger.debug("some");

  ctx.response.body = {
    message: "hello",
    requestData,
    config,
  };
});

service.addRouter(serviceRouter);

await service.listen();
