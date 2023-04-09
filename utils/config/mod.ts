import { load, LoadOptions } from "./deps.ts";

export const DEFAULT_DENO_JSON_PATH = "./deno.json";

export interface ConfigOptions extends LoadOptions {
  denoJsonPath?: string;
}

export class Config {
  env: any;
  denoJson: any;
  options?: ConfigOptions;

  constructor(options?: ConfigOptions) {
    this.options = options ?? {};
  }

  async setup() {
    const { denoJsonPath, ...envOptions } = this.options ?? {};
    try {
      const jsonTxt = await Deno?.readTextFile?.(
        denoJsonPath ?? DEFAULT_DENO_JSON_PATH,
      );
      this.denoJson = JSON.parse(jsonTxt);
    } catch (_e) {}

    try {
      this.env = await load(envOptions);
    } catch (_e) {}
  }
}
