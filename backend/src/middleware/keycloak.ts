import { Context } from "hono";
const keycloakMiddleware = async (c: Context, next: () => Promise<void>) => {
  //   todo: do the thing
    
  await next();
};
