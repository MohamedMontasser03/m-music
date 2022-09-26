import {
  commonYTBody,
  formatRecommendationResults,
  formatSearchResults,
  getPublicYoutubeAppKey,
  ytHeaders,
} from "../../utils/yt";

export async function getArtistResult(artistId: string) {
  try {
    const key = await getPublicYoutubeAppKey();
    const res = await fetch(
      `https://music.youtube.com/youtubei/v1/browse?key=${key}&prettyPrint=false`,
      {
        headers: ytHeaders,
        referrer: "https://music.youtube.com/explore",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: JSON.stringify({
          ...commonYTBody,
          browseId: artistId,
        }),
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    );
    const content = await res.json();
    return { content, ...formatRecommendationResults(content) };
  } catch (err) {
    console.error("An error occurred while fetching search results", err);
  }
}
