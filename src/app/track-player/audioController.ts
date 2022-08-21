import { usePlayerStore } from "./playerSlice";

type AudioController = {
  readonly setSrc: (src: string) => string;
  readonly getSrc: () => string;
  readonly pause: () => void;
  readonly play: () => Promise<void>;
  readonly getIsPlaying: () => boolean;
  readonly getDuration: () => number;
  readonly getCurrentTime: () => number;
  readonly setCurrentTime: (time: number) => number;
  readonly setVolume: (volume: number) => number;
};

export const audioController: AudioController | undefined = (() => {
  if (typeof window === "undefined") return undefined;
  const el = new Audio();

  el.addEventListener("timeupdate", () => {
    usePlayerStore.getState().actions.syncProgress();
  });
  el.addEventListener("play", () => {
    usePlayerStore.getState().actions.play();
  });
  el.addEventListener("pause", () => {
    usePlayerStore.getState().actions.pause();
  });
  el.addEventListener("ended", () => {
    usePlayerStore.getState().actions.playNext();
  });

  // el.addEventListener("loadstart", () => {
  //   console.log("load-start", el.readyState);
  // });
  // el.addEventListener("loadeddata", () => {
  //   console.log("load success", el.readyState);
  // });
  // el.addEventListener("waiting", () => {
  //   console.log("waiting", el.readyState);
  // });
  // el.addEventListener("error", () => {
  //   console.log("error while loading state", el.readyState);
  // });
  // el.addEventListener("canplay", () => {
  //   console.log("no error and done waiting while loading state", el.readyState);
  // });

  return {
    setSrc: (src: string) => (el.src = src),
    getSrc: () => el.src,
    pause: () => el.pause(),
    play: () => el.play(),
    getIsPlaying: () =>
      el?.currentTime > 0 &&
      !el?.paused &&
      !el?.ended &&
      el?.readyState > el?.HAVE_CURRENT_DATA,
    getDuration: () => el.duration,
    getCurrentTime: () => el.currentTime,
    setCurrentTime: (time: number) => (el.currentTime = time),
    setVolume: (volume: number) => (el.volume = volume),
  } as AudioController;
})();
