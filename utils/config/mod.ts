import { load } from "./deps.ts";

export const DEFAULT_DENO_JSON_PATH = "./deno.json";
export const DEFAULT_ENV_PATH = "./.env";

export interface ConfigOptions {
  denoJsonPath?: string;
  envPath?: string;
}

export class Config {
  dotEnv: any;
  denoJson: any;
  config: any;
  options?: ConfigOptions;

  constructor(options?: ConfigOptions) {
    this.options = options ?? {};
  }

  async setup() {
    const { denoJsonPath, envPath } = this.options ?? {};

    try {
      const jsonTxt = await Deno?.readTextFile?.(
        denoJsonPath ?? DEFAULT_DENO_JSON_PATH,
      );
      this.denoJson = JSON.parse(jsonTxt);
    } catch (_e) {}

    try {
      this.dotEnv = await load({ envPath: envPath ?? DEFAULT_ENV_PATH });
    } catch (_e) {}

    if (this.denoJson) {
      delete this.denoJson.tasks;
    }

    const config = { ...this.denoJson, ...this.dotEnv };

    this.config = config;
    return config;
  }
}
