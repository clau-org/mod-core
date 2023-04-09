// Import required modules
import { Application, oakCors, Router, Logger, LogLevels } from "./deps.ts";
import { middlewareError } from "./middleware/error.ts";

// Define types for API context and configuration
export interface ServiceContext {
  logger: Logger;
  //   dbClient?: DBClient;
}

export interface ServiceOptions {
  name?: string;
  port?: number;
  logLevel?: LogLevels;
  dbUrl?: string;
  [key: string]: any;
}

// Define a custom router that extends Oak's Router
export class ServiceRouter extends Router {}

// Define an API class that uses Oak and the custom router
export class Service {
  app?: Application<ServiceContext>;
  routers: ServiceRouter[];
  logger: Logger;
  //   dbClient?: DBClient;

  config?: ServiceOptions;

  constructor(options?: ServiceOptions) {
    const {
      name = "service",
      dbUrl,
      logLevel = LogLevels.DEBUG,
    } = options ?? {};

    // Save the configuration options
    this.config = options;

    // Create a logger instance with the API name as prefix
    this.logger = new Logger({
      prefix: name,
      level: logLevel,
      datetime: true,
      stringify: false,
    });

    // Create a DBClient instance if exist dbUrl
    // if (dbUrl) {
    //   this.dbClient = new DBClient({
    //     datasources: {
    //       db: { url: dbUrl },
    //     },
    //   });
    // }

    // Create an empty array to store the routers
    this.routers = [];
    this.logger.debug("[service.constructor]", "service created");
  }

  // Add a router to the API
  addRouter(router: ServiceRouter) {
    this.routers.push(router);

    router.forEach(({ path }) =>
      this.logger.debug("[service.addRouter]", "route added", { path })
    );
  }

  // Set dbUrl on DBClient and initialize the client
  //   setDBUrl({ url }: { url: string }) {
  //     this.dbClient = new DBClient({ datasources: { db: { url } } });
  //     this.logger.debug(`[method: dbUrl][db url changed]`, { url });
  //   }

  setupService() {
    const { logger } = this;

    // Create a new Oak application instance
    this.app = new Application<ServiceContext>();

    // Set application context
    const state: ServiceContext = {
      logger: this.logger,
      //   dbClient: this.dbClient,
    };

    this.app.state = state;

    // Add CORS middleware to the app
    this.app.use(oakCors());

    // Add generic error handler middleware
    this.app.use(middlewareError);

    // Add each router's routes and allowed methods to the app
    for (const router of this.routers) {
      this.app.use(router.routes());
      this.app.use(router.allowedMethods());
    }

    logger.debug(`[service.setupApp]`, "routers added");
    logger.debug("[service.setupApp]", "setup finished");
  }

  addEventListener() {
    const { logger } = this;

    if (!this.app) {
      return logger.error(
        "[service.addEventListener]",
        "service its not setup",
      );
    }

    // Listen for the "listen" event and log when the App starts
    this.app.addEventListener("listen", ({ port, secure, hostname }) => {
      const { logger } = this;

      const protocol = secure ? "https" : "http";
      const url = `${protocol}://${hostname}:${port}`;

      const service = {
        hostname,
        secure,
        port,
        protocol,
        url,
      };

      logger.debug("[service.listen]", "service config", {
        config: this.config ?? [],
      });
      logger.info("[service.listen]", "service listening data", { service });
    });
  }

  listen({ port }: { port?: number } = {}) {
    this.setupService();

    this.addEventListener();

    const listenPort = port ?? this.config?.port ?? 8000;
    return this.app?.listen({ port: listenPort });
  }
}
