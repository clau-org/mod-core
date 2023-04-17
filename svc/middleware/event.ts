import { getQuery, Middleware, Schema, ZodError } from "../deps.ts";

// Define a middlewareGetEvent function that returns a Middleware
function middlewareGetEvent(schema?: Schema) {
  const middleware: Middleware = async (ctx, next): Promise<any> => {
    const { logger } = ctx.app.state;

    try {
      // Initialize event property
      ctx.state.event = {};

      // Get request body and query parameters
      let body = await ctx.request.body().value;
      const bodyUrl = Object.fromEntries(body?.entries?.() || []);
      const query = getQuery(ctx);

      // Clear body if body is URL encoded
      if (Object.keys(bodyUrl).length > 0) body = {};

      // Combine body, bodyUrl, and query parameters into a single object
      const data = {
        ...body,
        ...bodyUrl,
        ...query,
      };

      logger.debug("[middlewareGetEvent]", "before validation", {
        data,
      });

      // Validate data against the provided schema, if provided
      if (schema) schema.parse(data);

      logger.debug("[middlewareGetEvent]", "after validation", {
        data,
      });

      // Set requestData property to the validated data
      ctx.state.event = data;

      // Call the next middleware function
      await next();
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof ZodError) {
        // Log the validation error and return a 400 status with the error message
        logger.error("[middlewareGetEvent]", "validation error", {
          error,
        });
        ctx.response.status = 400;
        ctx.response.body = { error };
      } else {
        // Rethrow other types of errors
        throw error;
      }
    }
  };

  return middleware;
}

// Export the validate function
export { middlewareGetEvent };
