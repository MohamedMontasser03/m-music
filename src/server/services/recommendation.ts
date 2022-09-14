import {
  commonYTBody,
  formatRecommendationResults,
  formatSearchResults,
  getPublicYoutubeAppKey,
  RecommendationReturnType,
  ytHeaders,
} from "../../utils/yt";

export async function getRecommendation({
  continuation,
  trackingParam,
}: Omit<RecommendationReturnType, "sections">): Promise<
  RecommendationReturnType | undefined
> {
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

export async function getExploreResult() {
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
          browseId: "FEmusic_explore",
        }),
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    );
    return formatRecommendationResults<"explore">(await res.json());
  } catch (err) {
    console.error("An error occurred while fetching video data", err);
  }
}

export async function getGenreResult(params: string) {
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
          browseId: "FEmusic_moods_and_genres_category",
          params,
        }),
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    );
    const content = await res.json();
    return {
      title: content.header.musicHeaderRenderer.title.runs[0].text,
      data: formatRecommendationResults(content),
    };
  } catch (err) {
    console.error("An error occurred while fetching genre video data", err);
  }
}

export async function getSearchSuggestions(input: string) {
  try {
    const key = await getPublicYoutubeAppKey();

    const res = await fetch(
      `https://music.youtube.com/youtubei/v1/music/get_search_suggestions?key=${key}&prettyPrint=false`,
      {
        headers: ytHeaders,
        body: JSON.stringify({
          ...commonYTBody,
          input,
        }),
        method: "POST",
      }
    );
    const data = await res.json();
    return (
      data?.contents[0]?.searchSuggestionsSectionRenderer?.contents?.map(
        (item: any) =>
          item.searchSuggestionRenderer.suggestion.runs
            .map((i: any) => i.text)
            .join("")
      ) ?? []
    );
  } catch (err) {
    console.error("An error occurred while fetching search suggestions", err);
  }
}

export async function getSearchResult(query: string) {
  try {
    const key = await getPublicYoutubeAppKey();
    const res = await fetch(
      `https://music.youtube.com/youtubei/v1/search?key=${key}&prettyPrint=false`,
      {
        headers: ytHeaders,
        referrer: "https://music.youtube.com/explore",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: JSON.stringify({
          ...commonYTBody,
          browseId: "FEmusic_moods_and_genres_category",
          query,
        }),
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    );
    const content = await res.json();
    return { content, ...formatSearchResults(content) };
  } catch (err) {
    console.error("An error occurred while fetching search results", err);
  }
}
