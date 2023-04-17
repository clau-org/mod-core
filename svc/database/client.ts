import { loadConfig } from "../deps.ts";
export interface databaseClientOptions {
  PrismaClient: any;
  url?: string;
}

export async function defineDatabaseClient<t>(
  options: databaseClientOptions,
) {
  let { PrismaClient, url } = options;
  const { denojson, env } = await loadConfig();

  url = url ?? env.DB_PROXY_URL ?? denojson.dbUrl;

  const client: t = new PrismaClient({ datasources: { db: { url } } }) as t;

  return client;
}