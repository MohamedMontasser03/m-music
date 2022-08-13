import { createRouter } from "./context";
import { z } from "zod";
import ytdl from "ytdl-core";

export const detailsRouter = createRouter().query(".video", {
  input: z.object({
    id: z.string(),
  }),
  async resolve({ input }) {
    const vidInfo = await ytdl.getInfo(input.id);
    return {
      id: vidInfo.videoDetails.videoId,
      title: vidInfo.videoDetails.title,
      authorId: vidInfo.videoDetails.author.id,
      author: vidInfo.videoDetails.author.name,
      thumbnails: vidInfo.videoDetails.thumbnails,
      duration: vidInfo.videoDetails.lengthSeconds,
      audioFormats: vidInfo.formats.filter((f) => f.hasAudio && !f.hasVideo),
      videoFormats: vidInfo.formats.filter((f) => f.hasVideo && !f.hasAudio),
      videoAudioFormats: vidInfo.formats.filter(
        (f) => f.hasVideo && f.hasAudio
      ),
      format: ytdl(input.id, { filter: "audioonly" }),
    };
  },
});
