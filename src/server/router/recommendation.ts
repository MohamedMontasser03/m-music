import { createRouter } from "./context";
import { z } from "zod";
import { getRecommendation } from "../services/recommendation";

export const recommendationRouter = createRouter().query("", {
  input: z.object({
    cursor: z
      .object({
        continuation: z.string(),
        trackingParam: z.string(),
      })
      .nullish(),
  }),
  async resolve({ input }) {
    return {
      key: await getRecommendation({
        continuation: input?.cursor?.continuation,
        trackingParam: input?.cursor?.trackingParam,
      }),
    };
  },
});
