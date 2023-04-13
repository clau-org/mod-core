// Import required modules
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
} from "./deps.ts";
import { middlewareError } from "./middleware/error.ts";
import { middlewareRequestData } from "./middleware/request_data.ts";

// Define types for API context and configuration
export interface ServiceRouteOptions {
  middlewares?: Middleware[];
  handler?: Function;
  schema?: Schema;
}

const defaultHandler: Middleware = (ctx) => {
  const { logger } = ctx.app.state as ServiceState;
  logger.info("defaultHandler");
  ctx.response.body = "defaultHandler";
};
export class ServiceRoute {
  path: string;
  middlewares: Middleware[];
  handler: Function;
  schema?: Schema;

  constructor(path: string, options?: ServiceRouteOptions) {
    const { middlewares, handler, schema } = options ?? {};
    this.path = path;
    this.middlewares = middlewares ?? [];
    this.handler = handler ?? defaultHandler;
    this.schema = schema;
  }

  addMiddleware(middleware: Middleware) {
    this.middlewares.push(middleware);
  }

  setHandler(middleware: Middleware) {
    this.handler = middleware;
  }

  setSchema(schema: Schema) {
    this.schema = schema;
  }
}

// Define a custom router that extends Oak's Router
export class ServiceRouter extends Router {
  addRoute(route: ServiceRoute) {
    this.all(
      route.path,
      middlewareRequestData(route.schema),
      // @ts-ignore
      ...route.middlewares,
      // @ts-ignore
      route.handler,
    );
  }
}

export interface ServiceOptions extends ConfigOptions {
  name?: string;
  port?: number;
  logLevel?: LogLevels;
  routers?: ServiceRouter[];
  router?: ServiceRouter;
  [key: string]: any;
}

export interface ServiceState {
  logger: Logger;
  config: Config;
  [key: string]: any;
}

// Define an API class that uses Oak and the custom router
export class Service<T extends ServiceState> {
  app: Application<T>;
  routers: ServiceRouter[];
  router: ServiceRouter;
  logger: Logger;
  options: ServiceOptions;
  config: Config;

  constructor(options?: ServiceOptions) {
    const {
      name = "service",
      logLevel = LogLevels.DEBUG,
      denoJsonPath,
      envPath,
      routers,
      router,
    } = options ?? {};

    // Save the configuration options
    this.options = options ?? {};

    this.config = new Config({
      denoJsonPath,
      envPath,
    });

    // Create a logger instance with the API name as prefix
    this.logger = new Logger({
      prefix: name,
      level: logLevel,
      datetime: true,
      stringify: false,
    });

    // Create an empty array to store the routers
    this.routers = routers ?? [];
    this.logger.debug("[service.constructor]", "service created");

    this.router = router ?? new ServiceRouter();

    // Create a new Oak application instance
    this.app = new Application<T>();

    // Set application context
    const state: T = {
      ...({ logger: this.logger, config: this.config } as ServiceState),
    } as T;

    this.app.state = state;

    // Add CORS middleware to the app
    this.app.use(oakCors());

    // Add generic error handler middleware
    this.app.use(middlewareError);

    this.setupRouters();

    this.addEventListener();
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
    this.logger.debug("[service.addRoute]", "route added", )
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
    this.app.addEventListener("listen", ({ port, secure, hostname }) => {
      const { logger } = this;

      const host = hostname === "0.0.0.0" ? "localhost" : hostname; 
      const protocol = secure ? "https" : "http";
      const url = `${protocol}://${host}:${port}`;
      const service = {
        hostname,
        secure,
        port,
        protocol,
        url,
      };

      logger.debug("[service.listen]", "service options", {
        options: this.options ?? [],
      });
      logger.info("[service.listen]", "service listening data", { service });
    });
  }

  async listen({ port }: { port?: number } = {}) {
    await this.app.state.config.setup();

    const listenPort = port ?? this.options?.port ?? 8000;
    return this.app?.listen({ port: listenPort });
  }
}
