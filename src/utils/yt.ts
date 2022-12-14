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
    // "client": {
    //   "hl": "en-GB",
    //   "gl": "EG",
    //   "remoteHost": "41.37.122.236",
    //   "deviceMake": "",
    //   "deviceModel": "",
    //   "visitorData": "Cgt4bzlyWG83cjJCdyjM_8CZBg%3D%3D",
    //   "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36,gzip(gfe)",
    //   "clientName": "WEB_REMIX",
    //   "clientVersion": "1.20220919.01.00",
    //   "osName": "Windows",
    //   "osVersion": "10.0",
    //   "originalUrl": "https://music.youtube.com/",
    //   "platform": "DESKTOP",
    //   "clientFormFactor": "UNKNOWN_FORM_FACTOR",
    //   "configInfo": {
    //     "appInstallData": "CMz_wJkGEM2F_hIQuIuuBRC3yK4FEP24_RIQ4rmuBRDbyq4FELfLrQUQ1IOuBRDgza4FEL7ErgUQmcauBRDqyq4FEL3NrgUQy-z9EhDYvq0F"
    //   },
    //   "browserName": "Chrome",
    //   "browserVersion": "105.0.0.0",
    //   "screenWidthPoints": 1009,
    //   "screenHeightPoints": 649,
    //   "screenPixelDensity": 1,
    //   "screenDensityFloat": 1,
    //   "utcOffsetMinutes": 120,
    //   "userInterfaceTheme": "USER_INTERFACE_THEME_DARK",
    //   "timeZone": "Africa/Cairo",
    //   "musicAppInfo": {
    //     "pwaInstallabilityStatus": "PWA_INSTALLABILITY_STATUS_UNKNOWN",
    //     "webDisplayMode": "WEB_DISPLAY_MODE_BROWSER",
    //     "storeDigitalGoodsApiSupportStatus": {
    //       "playStoreDigitalGoodsApiSupportStatus": "DIGITAL_GOODS_API_SUPPORT_STATUS_UNSUPPORTED"
    //     },
    //     "musicActivityMasterSwitch": "MUSIC_ACTIVITY_MASTER_SWITCH_INDETERMINATE",
    //     "musicLocationMasterSwitch": "MUSIC_LOCATION_MASTER_SWITCH_INDETERMINATE"
    //   }
    // },
    user: {
      enableSafetyMode: true,
      lockedSafetyMode: false,
    },
  },
} as const;

export type Tile = {
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
};

export type GenreList = {
  type: "genre";
  title: string;
  color: string;
  id: string;
};

export type HomeReturnType = {
  continuation?: string;
  trackingParam?: string;
  sections: {
    title: string;
    items: Tile[];
  }[];
};
export type ExploreReturnType = {
  continuation?: string;
  trackingParam?: string;
  sections: {
    title: string;
    items: (Tile | GenreList)[];
  }[];
};

export type RecommendationReturnType<T extends "home" | "explore" = "home"> =
  T extends "home" ? HomeReturnType : ExploreReturnType;

export function formatRecommendationResults<
  T extends "home" | "explore" = "home"
>(
  rec: any // Youtube's Api response is so big that it's not worth creating a type for it
): RecommendationReturnType<T> {
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
      .filter(
        (section: any) =>
          section.musicCarouselShelfRenderer || section.gridRenderer
      )
      .map((section: any) => ({
        title:
          section.musicCarouselShelfRenderer?.header
            ?.musicCarouselShelfBasicHeaderRenderer?.title?.runs[0].text ??
          section.gridRenderer?.header?.gridHeaderRenderer?.title?.runs[0].text,
        items: formatMusicList(
          section.musicCarouselShelfRenderer?.contents ??
            section.gridRenderer?.items
        ),
      })),
    continuation,
    trackingParam,
  };
}

// export function formatArtistResults<T extends "home" | "explore" = "home">(
//   rec: any // Youtube's Api response is so big that it's not worth creating a type for it
// ): {
//   sections: RecommendationReturnType<T>["sections"];
//   artist: {
//     name: string;
//     url: string;
//     description?: string;
//   };
// } {
//   const base =
//     rec.contents?.singleColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer
//       ?.content?.sectionListRenderer ||
//     rec?.continuationContents?.sectionListContinuation;
//   return {
//     sections: base.contents
//       .filter(
//         (section: any) =>
//           section.musicCarouselShelfRenderer || section.gridRenderer
//       )
//       .map((section: any) => ({
//         title:
//           section.musicCarouselShelfRenderer?.header
//             ?.musicCarouselShelfBasicHeaderRenderer?.title?.runs[0].text ??
//           section.gridRenderer?.header?.gridHeaderRenderer?.title?.runs[0].text,
//         items: formatMusicList(
//           section.musicCarouselShelfRenderer?.contents ??
//             section.gridRenderer?.items
//         ),
//       })),
//   };
// }

export function formatSearchResults(
  rec: any // Youtube's Api response is so big that it's not worth creating a type for it
): {
  sections: { title: string; items: Tile[] }[];
} {
  const base =
    rec.contents.tabbedSearchResultsRenderer.tabs[0].tabRenderer.content
      .sectionListRenderer.contents;

  return {
    sections: base.map((section: any) => ({
      title: section.musicShelfRenderer?.title?.runs[0].text,
      items: formatMusicList(section.musicShelfRenderer?.contents),
    })),
  };
}

function formatMusicList(musicList: any) {
  if (musicList?.[0].musicResponsiveListItemRenderer) {
    const author = (track: any) =>
      track.musicResponsiveListItemRenderer.flexColumns[1].musicResponsiveListItemFlexColumnRenderer?.text?.runs.find(
        (run: any) =>
          ["MUSIC_PAGE_TYPE_ARTIST", "MUSIC_PAGE_TYPE_USER_CHANNEL"].includes(
            run.navigationEndpoint?.browseEndpoint
              ?.browseEndpointContextSupportedConfigs
              ?.browseEndpointContextMusicConfig.pageType
          )
      );

    const id = (track: any) =>
      track.musicResponsiveListItemRenderer.flexColumns[0]
        .musicResponsiveListItemFlexColumnRenderer.text.runs[0]
        ?.navigationEndpoint?.watchEndpoint.videoId ??
      track.musicResponsiveListItemRenderer.overlay
        ?.musicItemThumbnailOverlayRenderer?.content?.musicPlayButtonRenderer
        ?.playNavigationEndpoint?.watchPlaylistEndpoint?.playlistId ??
      track.musicResponsiveListItemRenderer.navigationEndpoint?.browseEndpoint
        ?.browseId;
    return musicList.map((track: any) => ({
      type: (id(track)?.length || 0) >= 24 ? "playlist" : "track",
      title:
        track.musicResponsiveListItemRenderer.flexColumns?.[0]
          .musicResponsiveListItemFlexColumnRenderer.text.runs?.[0].text,
      id: id(track),
      authorName: author(track)?.text,
      authorId:
        author(track)?.navigationEndpoint?.browseEndpoint?.browseId ??
        track.musicResponsiveListItemRenderer.navigationEndpoint?.browseEndpoint
          ?.browseId,
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
  if (musicList?.[0].musicNavigationButtonRenderer) {
    return musicList.map((track: any) => ({
      type: "genre",
      title: track.musicNavigationButtonRenderer.buttonText.runs[0].text,
      color: track.musicNavigationButtonRenderer.solid?.leftStripeColor,
      id: track.musicNavigationButtonRenderer.clickCommand.browseEndpoint
        .params,
    }));
  }
  return [];
}
