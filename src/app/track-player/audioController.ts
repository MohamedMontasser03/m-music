import { usePlayerStore } from "./playerSlice";

export const audioController = (() => {
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
  } as const;
})();
