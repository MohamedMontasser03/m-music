import { createRouter } from "./context";
import { z } from "zod";
import {
  getExploreResult,
  getGenreResult,
  getRecommendation,
  getSearchResult,
  getSearchSuggestions,
} from "../services/recommendation";
import { TRPCError } from "@trpc/server";

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
  })
  .query(".search", {
    input: z.object({
      query: z.string(),
    }),
    resolve({ input }) {
      return getSearchResult(input.query);
    },
  })
  .query(".search.suggestions", {
    input: z.object({
      query: z.string(),
    }),
    resolve({ input }) {
      return getSearchSuggestions(input.query);
    },
  });
