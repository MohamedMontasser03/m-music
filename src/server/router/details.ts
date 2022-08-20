import { createRouter } from "./context";
import { z } from "zod";
import ytdl from "ytdl-core";
import ytpl from "ytpl";
import { type TrackType } from "../../app/track-player/playerSlice";

export const detailsRouter = createRouter()
  .query(".video", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }): Promise<TrackType> {
      const vidInfo = await ytdl.getBasicInfo(input.id);
      return {
        id: vidInfo.videoDetails.videoId,
        title: vidInfo.videoDetails.title,
        authorId: vidInfo.videoDetails.author.id,
        authorName: vidInfo.videoDetails.author.name,
        thumbnails: vidInfo.videoDetails.thumbnails,
        duration: +vidInfo.videoDetails.lengthSeconds,
      };
    },
  })
  .query(".playlist", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }): Promise<TrackType[]> {
      const playlistInfo = await ytpl(input.id);
      return playlistInfo.items.map((item) => ({
        id: item.id,
        title: item.title,
        authorId: item.author.channelID,
        authorName: item.author.name,
        thumbnails: item.thumbnails as {
          url: string;
          width: number;
          height: number;
        }[],
        duration: item.durationSec || 0,
      }));
    },
  });
