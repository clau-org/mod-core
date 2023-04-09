import { PrismaClient } from "./generated/client/deno/edge.ts";

// export interface DBClientOptions {
//   url?: string;
// }

export class DBClient extends PrismaClient {
  client?: PrismaClient;
  [key: string]: any; // add index signature to allow string keys
  constructor(url?: string) {
    if (url) super({ datasources: { db: { url } } })
    else super()
  }

  setUrl(url: string) {
    const newClient = new DBClient(url);
    Object.assign(this, newClient);
  }
}
