import {
  defineService,
  ServiceContext as DefaultServiceContext,
} from "./deps.ts";
import { DBClient, default as dbClient } from "./database/client.ts";

import usersCreate from "./routes/users/create.ts";
import usersRead from "./routes/users/read.ts";
import usersUpdate from "./routes/users/update.ts";
import usersDelete from "./routes/users/delete.ts";

const eventHandlers = [
  usersCreate,
  usersRead,
  usersUpdate,
  usersDelete,
];
export interface ServiceContext extends DefaultServiceContext {
  db: DBClient;
}

export default await defineService({ dbClient, eventHandlers });
