import { Middleware } from "../deps.ts";
import { middlewareGetEvent } from "../middleware/event.ts";
import { ServiceContext } from "./service.ts";

export interface HandlerResponse {
  message?: string;
  error?: any;
  data?: any;
}

export interface Handler {
  (ctx: ServiceContext): HandlerResponse | Promise<HandlerResponse>;
}

export interface EventHandlerOptions {
  path: string;
  handler: Handler;
  schema?: any;
  middlewares?: any[];
}

export interface EventHandler {
  path: string;
  handler: Middleware;
  validateSchema: Middleware;
  middlewares: any[];
}

export function defineEventHandler(
  options: EventHandlerOptions,
): EventHandler {
  const {
    path,
    handler: _handler,
    schema,
    middlewares = [],
  } = options;

  const validateSchema: Middleware = middlewareGetEvent(schema);

  const handler: Middleware = async (ctx) => {
    const { logger, config, db } = ctx.app.state;
    const event = ctx.state.event;
    const actionResult = await _handler({ event, logger, config, db });
    ctx.response.body = {
      ...actionResult,
    };
  };

  return {
    path,
    validateSchema,
    middlewares,
    handler,
  };
}
