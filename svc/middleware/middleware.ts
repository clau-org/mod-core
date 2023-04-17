import { Middleware as OakMiddleware } from "../deps.ts";
import { ServiceContext } from "../service/service.ts";

export interface Middleware {
  (ctx: ServiceContext, next: () => Promise<unknown>): any;
}

export function defineMiddleware(action: Middleware): OakMiddleware {
  const middleware: OakMiddleware = async (ctx, next) => {
    const { logger, config, db } = ctx.app.state;
    const event = ctx.state.event;
    await action({ event, logger, config, db, ctx }, next);
  };
  return middleware;
}
