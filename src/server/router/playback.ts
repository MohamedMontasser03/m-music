import { createRouter } from "./context";
import { z } from "zod";
import ytdl from "ytdl-core";

export const playbackRouter = createRouter().query(".audio", {
  input: z.object({
    id: z.string(),
  }),
  async resolve({ input }): Promise<{
    url?: string;
  }> {
    const vidInfo = await ytdl.getInfo(input.id);
    const audioFormats = ytdl.filterFormats(vidInfo.formats, "audioonly");
    return {
      url: audioFormats[0]?.url,
    };
  },
});
