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
    try {
      const vidInfo = await ytdl.getInfo(input.id);
      const audioFormats = ytdl.filterFormats(vidInfo.formats, "audioonly");
      console.log("s");
      try {
        // set timeout to 5 seconds
        const res = await fetch(audioFormats[0]!.url, {
          headers: {
            accept: "*/*",
            "accept-language":
              "en-GB,en;q=0.9,ar-EG;q=0.8,ar;q=0.7,en-US;q=0.6",
            range: "bytes=0-",
            "sec-ch-ua":
              '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "audio",
            "sec-fetch-mode": "no-cors",
            "sec-fetch-site": "cross-site",
            "x-client-data": "CIa2yQEIo7bJAQjEtskBCKmdygEIlKHLAQiTvMwBCJK9zAE=",
          },
          referrer: "http://localhost:3000/",
          referrerPolicy: "strict-origin-when-cross-origin",
          body: null,
          method: "GET",
          mode: "cors",
          credentials: "omit",
        });

        console.log(res.status);
      } catch (err) {}
      console.log("k");

      return {
        url: audioFormats[0]?.url,
      };
    } catch (error) {
      console.error(error);
      return {};
    }
  },
});
