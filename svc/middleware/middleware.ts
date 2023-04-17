import { Middleware as OakMiddleware } from "../deps.ts";
import { defaultServiceContext } from "../service/service.ts";

export interface Middleware<t> {
  (ctx: defaultServiceContext<t>, next: () => Promise<unknown>): any;
}

export function defineMiddleware<t>(action: Middleware<t>): OakMiddleware {
  const middleware: OakMiddleware = async (ctx, next) => {
    const { logger, config, db } = ctx.app.state;
    const event = ctx.state.event;
    await action({ event, logger, config, db }, next);
  };
  return middleware;
}
