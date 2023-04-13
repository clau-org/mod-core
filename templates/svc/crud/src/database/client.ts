import { createDBClient } from "../deps.ts";
import { PrismaClient } from "./generated/client/deno/edge.ts";

export const DBClient = createDBClient(PrismaClient);
