import {
  defineService,
  ServiceContext as DefaultServiceContext,
} from "./deps.ts";
import { DBClient, default as dbClient } from "./database/client.ts";
import hello from "./routes/hello/index.ts";

export interface ServiceContext extends DefaultServiceContext {
  db: DBClient;
}

export default await defineService({ dbClient, eventHandlers: [hello] });
