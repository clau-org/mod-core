import { ServiceRouter } from "../deps.ts";

import { route as routeCreate } from "./create.ts";
import { route as routeRead } from "./read.ts";
import { route as routeUpdate } from "./update.ts";
import { route as routeDelete } from "./delete.ts";

const serviceRouter = new ServiceRouter({
  prefix: "/users",
});

serviceRouter.addRoute(routeCreate);
serviceRouter.addRoute(routeRead);
serviceRouter.addRoute(routeUpdate);
serviceRouter.addRoute(routeDelete);

export { serviceRouter };
