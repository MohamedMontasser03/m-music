import { createRouter } from "./context";
import { z } from "zod";
import ytdl from "ytdl-core";
import ytpl from "ytpl";
import internal from "stream";

export type TrackInfo = {
  id: string;
  title: string;
  authorId: string;
  author: string;
  thumbnails: ytdl.thumbnail[];
  duration: string;
  audioFormats: ytdl.videoFormat[];
  videoFormats: ytdl.videoFormat[];
  videoAudioFormats: ytdl.videoFormat[];
};

export const detailsRouter = createRouter()
  .query(".video", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }): Promise<TrackInfo> {
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
      };
    },
  })
  .query(".playlist", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }): Promise<TrackInfo[]> {
      const playlistInfo = await ytpl(input.id);
      return Promise.all(
        playlistInfo.items.map(async ({ id }) => {
          const vidInfo = await ytdl.getInfo(id);
          return {
            id: vidInfo.videoDetails.videoId,
            title: vidInfo.videoDetails.title,
            authorId: vidInfo.videoDetails.author.id,
            author: vidInfo.videoDetails.author.name,
            thumbnails: vidInfo.videoDetails.thumbnails,
            duration: vidInfo.videoDetails.lengthSeconds,
            audioFormats: vidInfo.formats.filter(
              (f) => f.hasAudio && !f.hasVideo
            ),
            videoFormats: vidInfo.formats.filter(
              (f) => f.hasVideo && !f.hasAudio
            ),
            videoAudioFormats: vidInfo.formats.filter(
              (f) => f.hasVideo && f.hasAudio
            ),
          };
        })
      );
    },
  });
