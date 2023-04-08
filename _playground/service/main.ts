/*  

// HOW TO IMPORT

// import from own module
import { } from "https://raw.githubusercontent.com/clau-org/mod-core/v0.0.2/service/mod.ts";

// import from main module
import { SERVICE } from "https://raw.githubusercontent.com/clau-org/mod-core/v0.0.1/mod.ts";
const {  } = SERVICE;

// import locally
import {  } from "../../service/mod.ts";

*/

import {
  Service,
  ServiceContext,
  // ServiceOptions,
  ServiceRouter,
  middlewareRequestData,
} from "../../service/mod.ts";

const service = new Service();

const serviceRouter = new ServiceRouter();

serviceRouter.all("/", middlewareRequestData(), (ctx) => {
  const { logger } = ctx.app.state as ServiceContext;
  const { requestData } = ctx.state;

  logger.debug("some");

  ctx.response.body = {
    message: "hello",
    requestData,
  };
});

service.addRouter(serviceRouter);

service.listen();
