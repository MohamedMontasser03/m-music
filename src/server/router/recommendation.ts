import { createRouter } from "./context";
import { z } from "zod";
import {
  getExploreResult,
  getGenreResult,
  getRecommendation,
} from "../services/recommendation";

export const recommendationRouter = createRouter()
  .query("", {
    input: z.object({
      cursor: z
        .object({
          continuation: z.string(),
          trackingParam: z.string(),
        })
        .nullish(),
    }),
    resolve({ input }) {
      return getRecommendation({
        continuation: input?.cursor?.continuation,
        trackingParam: input?.cursor?.trackingParam,
      });
    },
  })
  .query(".explore", {
    resolve() {
      return getExploreResult();
    },
  })
  .query(".genre", {
    input: z.object({
      id: z.string(),
    }),
    resolve({ input }) {
      return getGenreResult(input.id);
    },
  });
