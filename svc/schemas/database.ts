import { z } from "../deps.ts";

export const schemaUuid = z.string().uuid();
export const schemaId = z.string().min(12);
export const schemaIds = { id: schemaId.nullish(), uuid: schemaUuid.nullish() };
export const schemaPage = {
  page: z.number().positive().nullish(),
  pageSize: z.number().positive().nullish(),
};
