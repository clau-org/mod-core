import { Service, ServiceState } from "./deps.ts";
import { DBClient } from "./database/client.ts";
import { serviceRouter as routerUser } from "./users/router.ts";

const url =
  "prisma://aws-us-east-1.prisma-data.com/?api_key=mY4engKpoOtH3QVxb9NWeTZ_NWpEeoT6CcLwsDAtpsefXTby_mpAjYXQj1qLL0yF";

const db = new DBClient({
  datasources: {
    db: { url },
  },
});

interface MyServiceState extends ServiceState {
  db: typeof db;
}

const service = new Service<MyServiceState>();

service.app.state.db = db;

service.addRouter(routerUser);

export { service };
