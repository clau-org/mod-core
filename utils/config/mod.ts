import {
  config as configEnv,
  ConfigOptions as ConfigEnvOptions,
} from "./deps.ts";
import {} from "https://deno.land/std@0.182.0/fs/mod.ts";

export const DEFAULT_DENO_JSON_PATH = "./deno.json";

export interface ConfigOptions extends ConfigEnvOptions {
  denoJsonPath?: string;
}

export class Config {
  env: any;
  denoJson: any;
  constructor(options?: ConfigOptions) {
    const { denoJsonPath, ...envOptions } = options ?? {};
    let denoJson = null;

    try {
      denoJson = JSON.parse(
        Deno.readTextFileSync(denoJsonPath ?? DEFAULT_DENO_JSON_PATH)
      );
    } catch (_e) {}

    this.env = configEnv(envOptions);
    this.denoJson = denoJson;
  }
}
