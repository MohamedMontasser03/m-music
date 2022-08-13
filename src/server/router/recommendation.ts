import { createRouter } from "./context";
import { z } from "zod";
import { getInitialRecommendation } from "../services/recommendation";

export const recommendationRouter = createRouter().query("", {
  input: z
    .object({
      continuation: z.string().nullish(),
      trackingParam: z.string().nullish(),
    })
    .nullish(),
  async resolve({ input }) {
    return {
      key: await getInitialRecommendation({
        continuation: input?.continuation || undefined,
        trackingParam: input?.trackingParam || undefined,
      }),
    };
  },
});
