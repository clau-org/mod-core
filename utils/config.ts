import { load } from "./deps.ts";

export const DEFAULT_DENO_JSON_PATH = "./deno.json";
export const DEFAULT_ENV_PATH = "./.env";

export interface loadOptions {
  denoPath?: string;
  envPath?: string;
}

export async function loadFileDeno(path?: string) {
  // Read deno.json
  try {
    return JSON.parse(
      await Deno.readTextFile(path ?? DEFAULT_DENO_JSON_PATH),
    );
  } catch (_e) {}
  return {};
}

export async function loadFileEnv(path?: string) {
  // Read .env
  try {
    let file = await load({ envPath: path ?? DEFAULT_ENV_PATH });
    delete file.tasks;
    delete file.fmt;
    return file;
  } catch (_e) {}
  return {};
}

export async function loadConfig(options?: loadOptions) {
  const env = await loadFileEnv(options?.envPath);
  const denojson = await loadFileDeno(options?.denoPath);
  return {
    env,
    denojson,
  };
}
