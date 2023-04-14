import { load } from "./deps.ts";

export const DEFAULT_DENO_JSON_PATH = "./deno.json";
export const DEFAULT_ENV_PATH = "./.env";

export interface ConfigOptions {
  files?: {
    denoPath?: string;
    envPath?: string;
  };
  [key: string]: any;
  name?: string;
  version?: string;
  env?: string;
}

export class Config {
  files: {
    deno: {
      path: string;
      content?: any;
    };
    env: {
      path: string;
      content?: any;
    };
  };
  options?: ConfigOptions;
  [key: string]: any;
  name?: string;
  version?: string;
  env?: string;

  constructor(options?: ConfigOptions) {
    const {
      name = "clau",
      version = "0.0.0",
      env = "test",
      files: {
        denoPath = DEFAULT_DENO_JSON_PATH,
        envPath = DEFAULT_ENV_PATH,
      } = {},
      ...customData
    } = options ?? {};

    this.files = {
      deno: {
        path: denoPath,
      },
      env: {
        path: envPath,
      },
    };
    this.options = options ?? {};

    Object.entries(customData).forEach(([key, value]) => this[key] = value);

    this.name = name;
    this.version = version;
    this.env = env;
  }

  async setup() {
    const {
      denoPath = DEFAULT_DENO_JSON_PATH,
      envPath = DEFAULT_ENV_PATH,
    } = this.options ?? {};

    try {
      this.files.deno.content = JSON.parse(await Deno.readTextFile(denoPath));
    } catch (_e) {}

    try {
      this.files.env.content = await load({ envPath });
      delete this.files.deno.content.tasks;
      delete this.files.deno.content.fmt;
    } catch (_e) {}

    const config = { ...this.files.deno.content, ...this.files.env.content };
    Object.entries(config).forEach(([key, value]) => this[key] = value);
    return this;
  }
}

export const setupConfig = async () => await new Config().setup();
