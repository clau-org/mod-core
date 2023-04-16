import { logger, setupConfig } from "../../utils/mod.ts";
import { DBClient, PrismaClient } from "../../svc/database/client.ts";

const config = await setupConfig();

const db = new DBClient<PrismaClient>(PrismaClient);

db.setUrl(config.DB_PROXY_URL);

const createR = await db.create("test", {
  name: "test",
  some: "fields",
});

const readR = await db.read("test", {
  limit: 1,
  filter: { uuid: createR.uuid },
});

const updateR = await db.update("test", {
  query: { uuid: createR.uuid },
  update: { name: "new name", someother: "some" },
});

const deleteR = await db.delete("test", {
  query: { uuid: createR.uuid },
});

logger.log({
  createR,
  readR,
  updateR,
  deleteR,
  message: "s",
});
