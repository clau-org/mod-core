import {
  Application,
  Config,
  ConfigOptions,
  Logger,
  LogLevels,
  Middleware,
  oakCors,
  Router,
  Schema,
} from "../deps.ts";
import { middlewareError } from "../middleware/error.ts";
import { middlewareRequestData } from "../middleware/request_data.ts";
import { ServiceRouter } from "./router.ts";
import { ServiceRoute } from "./route.ts";

export interface ServiceOptions extends ConfigOptions {
  name?: string;
  version?: string;
  config?: Config;
  logger?: Logger;
  routers?: ServiceRouter[];
  router?: ServiceRouter;
  port?: number;
  logLevel?: LogLevels;
}

export interface DefaultServiceState {
  logger: Logger;
  config: Config;
  [key: string]: any;
}

// Define an API class that uses Oak and the custom router
export class Service<T extends DefaultServiceState> {
  name: string;
  version: string;
  config: Config;
  logger: Logger;
  app: Application<T>;
  routers: ServiceRouter[];
  router: ServiceRouter;
  options: ServiceOptions;

  constructor(options?: ServiceOptions) {
    const {
      name = "service",
      version = "0.0.0",
      logLevel = LogLevels.DEBUG,
      denoJsonPath,
      envPath,
      routers,
      router,
    } = options ?? {};

    this.options = options ?? {};

    this.name = name;
    this.version = version;

    this.config = new Config({ denoJsonPath, envPath });
    this.logger = new Logger({ prefix: this.name, level: logLevel });
    this.router = router ?? new ServiceRouter();
    this.routers = routers ?? [];
    this.app = new Application<T>();

    // Set application context
    const state: T = {
      ...({
        logger: this.logger,
        config: this.config,
      } as DefaultServiceState),
    } as T;

    this.app.state = state;

    // Add CORS middleware to the app
    this.app.use(oakCors());

    // Add generic error handler middleware
    this.app.use(middlewareError);

    this.setupRouters();
  }

  setupRouters() {
    const { logger } = this;

    // Add each router's routes and allowed methods to the app
    for (const router of this.routers) {
      this.app.use(router.routes());
      this.app.use(router.allowedMethods());
    }

    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());

    logger.debug(`[service.setupRouters]`, "routers setup");
  }

  // Add a router to the API
  addRouter(router: ServiceRouter) {
    this.routers.push(router);

    router.forEach(({ path }) =>
      this.logger.debug("[service.addRouter]", "route added", { path })
    );

    this.setupRouters();
  }

  addRoute(route: ServiceRoute) {
    this.logger.debug("[service.addRoute]", "route added");
    this.router.all(
      route.path,
      middlewareRequestData(route.schema),
      // @ts-ignore
      ...route.middlewares,
      // @ts-ignore
      route.handler,
    );
    this.setupRouters();
  }

  addEventListener() {
    // Listen for the "listen" event and log when the App starts
    this.app.addEventListener(
      "listen",
      ({ port, secure, hostname, timeStamp }) => {
        const { logger, name, version } = this;

        const host = hostname === "0.0.0.0" ? "localhost" : hostname;
        const protocol = secure ? "https" : "http";
        const url = `${protocol}://${host}:${port}`;
        const service = {
          name,
          version,
          hostname,
          timeStamp,
          secure,
          port,
          protocol,
          url,
        };

        logger.debug("[service.listen]", "service options", {
          options: this.options ?? [],
        });
        logger.info("[service.listen]", "service listening data", { service });
      },
    );
  }

  async setup() {
    await this.config.setup();
    await this.app.state.config.setup();

    const { name, version } = this.config.config;

    this.name = name;
    this.version = version;
    this.logger.prefix = name;

    this.addEventListener();
  }

  async listen({ port }: { port?: number } = {}) {
    await this.setup();
    const listenPort = port ?? this.options?.port ?? 8000;
    return this.app?.listen({ port: listenPort });
  }
}
