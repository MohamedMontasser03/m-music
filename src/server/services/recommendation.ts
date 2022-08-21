import {
  commonYTBody,
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
          ...commonYTBody,
          browseId: "FEmusic_home",
        }),
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    );
    return formatRecommendationResults(await res.json());
  } catch (err) {
    console.error("An error occurred while fetching video data", err);
  }
}
