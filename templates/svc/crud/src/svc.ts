import { DefaultServiceState, Service } from "./deps.ts";
import { DBClient } from "./database/client.ts";
import { route as routeCreate } from "./users/create.ts";
import { route as routeRead } from "./users/read.ts";
import { route as routeUpdate } from "./users/update.ts";
import { route as routeDelete } from "./users/delete.ts";

const url =
  "prisma://aws-us-east-1.prisma-data.com/?api_key=mY4engKpoOtH3QVxb9NWeTZ_NWpEeoT6CcLwsDAtpsefXTby_mpAjYXQj1qLL0yF";

const db = new DBClient({
  datasources: {
    db: { url },
  },
});

interface ServiceState extends DefaultServiceState {
  db: typeof db;
}

const service = new Service<ServiceState>();

service.app.state.db = db;

service.addRoute(routeCreate);
service.addRoute(routeRead);
service.addRoute(routeUpdate);
service.addRoute(routeDelete);

export { service };
