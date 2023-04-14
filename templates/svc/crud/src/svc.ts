import { Config, DefaultServiceState, Service } from "./deps.ts";
import { DBClient } from "./database/client.ts";
import { route as routeCreate } from "./users/create.ts";
import { route as routeRead } from "./users/read.ts";
import { route as routeUpdate } from "./users/update.ts";
import { route as routeDelete } from "./users/delete.ts";

const cofig = new Config()

const cofigData = await cofig.setup();


console.log({ cofig: cofigData })

const db = new DBClient({
  datasources: { db: { url: cofig.DATAPROXY_URL } },
});

interface ServiceState extends DefaultServiceState {
  db: typeof db;
}

const service = new Service<ServiceState>();

service.config = cofig;
service.app.state.db = db;

service.addRoute(routeCreate);
service.addRoute(routeRead);
service.addRoute(routeUpdate);
service.addRoute(routeDelete);

export { service };
