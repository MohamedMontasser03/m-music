import {
  formatRecommendationResults,
  getPublicYoutubeAppKey,
  RecommendationReturnType,
  ytHeaders,
} from "../../utils/yt";

export async function getRecommendation({
  continuation,
  trackingParam,
}: Omit<RecommendationReturnType, "sections">) {
  try {
    const key = await getPublicYoutubeAppKey();
    const continueQuery = continuation
      ? `&ctoken=${continuation}&continuation=${continuation}&type=next&itct=${trackingParam}`
      : "";
    const res = await fetch(
      `https://music.youtube.com/youtubei/v1/browse?key=${key}&prettyPrint=false${continueQuery}`,
      {
        headers: ytHeaders,
        referrer: "https://music.youtube.com/explore",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: JSON.stringify({
          context: {
            client: {
              hl: "en-GB",
              gl: "EG",
              clientName: "WEB_REMIX",
              clientVersion: "1.20220801.01.00",
              originalUrl: "https://music.youtube.com/",
              userAgent:
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0",
            },
          },
          browseId: "FEmusic_home",
        }),
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    );
    return formatRecommendationResults(await res.json());
  } catch (err) {
    console.error("Broke", err);
  }
}
