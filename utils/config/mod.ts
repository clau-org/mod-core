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
  options?: ConfigOptions;

  constructor(options?: ConfigOptions) {
    const { denoJsonPath, ...envOptions } = options ?? {};
    let denoJson = null;

    this.env = configEnv(envOptions);
    this.options = options;
    this.denoJson = denoJson;
  }

  async setup() {
    try {
      const jsonTxt = await Deno?.readTextFile?.(
        this.options?.denoJsonPath ?? DEFAULT_DENO_JSON_PATH,
      );
      this.denoJson = JSON.parse(jsonTxt);
    } catch (_e) {}
  }
}
