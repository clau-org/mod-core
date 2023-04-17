import { Application, Context, Logger, oakCors, Router } from "../deps.ts";
import { ServiceConfig, ServiceConfigOptions } from "./config.ts";
import {
  defineEventHandler,
  EventHandler,
  EventHandlerOptions,
} from "./event.ts";
import { middlewareError } from "../middleware/error.ts";
export interface defineServiceOptions extends ServiceConfigOptions {
  eventHandlers?: EventHandler[];
  dbClient?: any;
}

export interface ServiceContext {
  event: any;
  logger: Logger;
  config: ServiceConfig;
  ctx: Context;
  [key: string]: any;
}

function addEventHandler({
  eventHandler,
  oakApp,
  logger,
}: {
  eventHandler: EventHandler;
  oakApp: Application;
  logger: Logger;
}) {
  const router = new Router();
  router.all(
    eventHandler.path,
    eventHandler.validateSchema,
    ...eventHandler.middlewares,
    eventHandler.handler,
  );
  oakApp.use(router.routes());
  oakApp.use(router.allowedMethods());
  logger.debug("[defineService]", "eventHandler added", {
    path: eventHandler.path,
  });
}
export async function defineService(options: defineServiceOptions) {
  let {
    name,
    version,
    environment,
    port,
    logLevel,
    eventHandlers = [],
    dbClient,
  } = options;

  // Config
  const config = new ServiceConfig({
    name,
    version,
    environment,
    port,
    logLevel,
  });
  await config.load();

  // Logger
  const logger = new Logger({ prefix: config.name, level: config.logLevel });

  logger.debug("[defineService]", "configuration loaded");

  // Create Oak app
  const oakApp = new Application();
  oakApp.state = { logger, config, db: dbClient };

  // Default middlewares
  oakApp.use(oakCors());
  oakApp.use(middlewareError);

  // Add event listener
  oakApp.addEventListener("listen", ({ port, secure, hostname, timeStamp }) => {
    const { name, version, options, ...configData } = config;

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
    logger.debug("[service.listen]", "service config", {
      config: { name, version, ...configData },
    });
    logger.info("[service.listen]", "service listening data", { service });
  });

  // Create listen function
  const listen = async (listenPort?: number) => {
    // Setup event handlers
    eventHandlers.forEach((e) =>
      addEventHandler({ eventHandler: e, logger, oakApp })
    );
    const port = listenPort ?? config.port;
    return oakApp.listen({ port });
  };

  return { listen, config, logger, oakApp, eventHandlers };
}

export function defineServiceHandler(options: EventHandlerOptions) {
  return defineService({ eventHandlers: [defineEventHandler(options)] });
}
