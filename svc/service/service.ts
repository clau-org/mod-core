import { Application, Logger, oakCors, Router } from "../deps.ts";
import { ServiceConfig, ServiceConfigOptions } from "./config.ts";
import { EventHandler } from "./event.ts";
export interface defineServiceOptions extends ServiceConfigOptions {
  eventHandlers?: EventHandler[];
  dbClient?: any;
}

export interface ServiceContext {
  event: any;
  logger: Logger;
  config: ServiceConfig;
  [key: string]: any;
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

  // config
  const config = new ServiceConfig({
    name,
    version,
    environment,
    port,
    logLevel,
  });
  await config.load();

  // logger
  const logger = new Logger({ prefix: config.name, level: config.logLevel });

  logger.debug("[defineService]", "configuration loaded");

  // Create Oak app
  const oakApp = new Application();
  oakApp.state = {
    logger,
    config,
    db: dbClient,
  };

  oakApp.use(oakCors());
  for (const eventHandler of eventHandlers) {
    const router = new Router();
    router.all(
      eventHandler.path,
      eventHandler.validateSchema,
      // @ts-ignore
      ...eventHandler.middlewares,
      // @ts-ignore
      eventHandler.handler,
    );
    oakApp.use(router.routes());
    oakApp.use(router.allowedMethods());
    logger.debug("[defineService]", "eventHandler added", {
      path: eventHandler.path,
    });
  }
  const eventListener = ({ port, secure, hostname, timeStamp }: any) => {
    const { name, version } = config;

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

    // logger.debug("[service.listen]", "service config", { config });
    // logger.debug("[service.listen]", "service options", { options });
    logger.info("[service.listen]", "service listening data", { service });
  };
  oakApp.addEventListener("listen", eventListener);

  const listen = async (listenPort?: number) => {
    const port = listenPort ?? config.port;
    return oakApp.listen({ port });
  };

  return {
    listen,

    config,
    logger,
    oakApp,
  };
}
