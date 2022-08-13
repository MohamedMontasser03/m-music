// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { recommendationRouter } from "./recommendation";
import { protectedExampleRouter } from "./protected-example-router";
import { detailsRouter } from "./details";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("recommendation", recommendationRouter)
  .merge("details", detailsRouter)
  .merge("question.", protectedExampleRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
