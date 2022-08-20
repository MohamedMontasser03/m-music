// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { recommendationRouter } from "./recommendation";
import { detailsRouter } from "./details";
import { playbackRouter } from "./playback";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("recommendation", recommendationRouter)
  .merge("details", detailsRouter)
  .merge("playback", playbackRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
