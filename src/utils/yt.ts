export async function getPublicYoutubeAppKey() {
  const res = await fetch(`https://www.youtube.com/`);
  const page = await res.text();
  const ytInitData = page.split("var ytInitialData =");

  if (
    !ytInitData ||
    ytInitData.length < 2 ||
    page.split("innertubeApiKey").length < 1
  ) {
    return;
  }

  return page
    .split("innertubeApiKey")?.[1]
    ?.trim()
    ?.split(",")?.[0]
    ?.split('"')?.[2];
}

export const ytHeaders = {
  accept: "*/*",
  "accept-language": "en-GB,en;q=0.9",
  "content-type": "application/json",
  "sec-ch-ua":
    '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
  "sec-ch-ua-arch": '"x86"',
  "sec-ch-ua-bitness": '"64"',
  "sec-ch-ua-full-version": '"103.0.5060.134"',
  "sec-ch-ua-full-version-list":
    '".Not/A)Brand";v="99.0.0.0", "Google Chrome";v="103.0.5060.134", "Chromium";v="103.0.5060.134"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-model": "",
  "sec-ch-ua-platform": '"Windows"',
  "sec-ch-ua-platform-version": '"14.0.0"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "same-origin",
  "sec-fetch-site": "same-origin",
  "x-goog-visitor-id": "CgtlbFJPa01NaHNXVSjg266XBg%3D%3D",
  "x-youtube-client-name": "67",
  "x-youtube-client-version": "1.20220801.01.00",
} as const;

export const commonYTBody = {
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
} as const;

export type RecommendationReturnType = {
  continuation?: string;
  trackingParam?: string;
  sections: {
    title: string;
    items: {
      type: "track" | "playlist";
      title: string;
      id: string;
      authorName: string;
      authorId?: string;
      thumbnails: {
        url: string;
        width: number;
        height: number;
      }[];
    }[];
  }[];
};

export function formatRecommendationResults(
  rec: any // Youtube's Api response is so big that it's not worth creating a type for it
): RecommendationReturnType {
  const base =
    rec.contents?.singleColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer
      ?.content?.sectionListRenderer ||
    rec?.continuationContents?.sectionListContinuation;
  const continuation =
    base?.continuations?.[0].nextContinuationData?.continuation ||
    base?.continuations?.[0].nextContinuationData?.continuation;
  const trackingParam =
    base?.continuations?.[0].nextContinuationData?.clickTrackingParams ||
    base?.continuations?.[0].nextContinuationData?.clickTrackingParams;
  return {
    sections: base.contents
      .filter((section: any) => section.musicCarouselShelfRenderer)
      .map((section: any) => ({
        title:
          section.musicCarouselShelfRenderer.header
            .musicCarouselShelfBasicHeaderRenderer.title.runs[0].text,
        items: formatMusicList(section.musicCarouselShelfRenderer.contents),
      })),
    continuation,
    trackingParam,
  };
}

function formatMusicList(musicList: any) {
  if (musicList?.[0].musicResponsiveListItemRenderer) {
    return musicList.map((track: any) => ({
      type: "track",
      title:
        track.musicResponsiveListItemRenderer.flexColumns[0]
          .musicResponsiveListItemFlexColumnRenderer.text.runs[0].text,
      id: track.musicResponsiveListItemRenderer.flexColumns[0]
        .musicResponsiveListItemFlexColumnRenderer.text.runs[0]
        .navigationEndpoint.watchEndpoint.videoId,
      authorName:
        track.musicResponsiveListItemRenderer.flexColumns[1]
          .musicResponsiveListItemFlexColumnRenderer.text.runs[0].text,
      authorId:
        track.musicResponsiveListItemRenderer.flexColumns[1]
          .musicResponsiveListItemFlexColumnRenderer.text.runs[0]
          .navigationEndpoint?.browseEndpoint?.browseId,
      thumbnails:
        track.musicResponsiveListItemRenderer.thumbnail.musicThumbnailRenderer
          .thumbnail.thumbnails,
    }));
  }
  if (musicList?.[0].musicTwoRowItemRenderer) {
    const isTrack =
      !!musicList?.[0].musicTwoRowItemRenderer.navigationEndpoint?.watchEndpoint
        ?.videoId ||
      musicList?.[0].musicTwoRowItemRenderer.navigationEndpoint?.browseEndpoint
        ?.browseId.length === 17;

    return musicList.map((track: any) => ({
      type: isTrack ? "track" : "playlist",
      title: track.musicTwoRowItemRenderer.title.runs[0].text,
      id: isTrack
        ? track.musicTwoRowItemRenderer.navigationEndpoint.watchEndpoint
            ?.videoId ||
          track.musicTwoRowItemRenderer.menu.menuRenderer.items[3]
            .menuServiceItemRenderer.serviceEndpoint.queueAddEndpoint
            .queueTarget.playlistId
        : track.musicTwoRowItemRenderer.navigationEndpoint?.browseEndpoint?.browseId
            .split("")
            .slice(2)
            .join("") || "",
      authorName:
        track.musicTwoRowItemRenderer.subtitle.runs
          ?.map((run: any) => run.text)
          ?.join("") || "",
      thumbnails:
        track.musicTwoRowItemRenderer.thumbnailRenderer.musicThumbnailRenderer
          .thumbnail.thumbnails,
    }));
  }
  return [];
}
