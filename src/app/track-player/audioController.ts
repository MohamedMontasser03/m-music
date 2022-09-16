import { usePlayerStore } from "./playerSlice";

type AudioController = Readonly<{
  setSrc: (src: string) => string;
  getSrc: () => string;
  pause: () => void;
  play: () => Promise<void>;
  getIsPlaying: () => boolean;
  getDuration: () => number;
  getCurrentTime: () => number;
  setCurrentTime: (time: number) => number;
  setVolume: (volume: number) => number;
  getIsLoading: () => boolean;
  getErrors: () => MediaError[];
  clearErrors: () => void;
  setMuted: (muted: boolean) => boolean;
}>;

export const audioController: AudioController | undefined = (() => {
  if (typeof window === "undefined") return undefined;
  const el = new Audio();
  let errArray = [] as MediaError[];

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

  el.addEventListener("loadstart", () => {
    usePlayerStore.getState().actions.syncLoadingState();
  });
  el.addEventListener("loadeddata", () => {
    errArray = [];
    usePlayerStore.getState().actions.syncLoadingState();
  });
  el.addEventListener("waiting", () => {
    usePlayerStore.getState().actions.syncLoadingState();
  });
  el.addEventListener("canplay", () => {
    usePlayerStore.getState().actions.syncLoadingState();
  });
  el.addEventListener("error", () => {
    if (el.error?.message !== "" || el.error?.code === 4) {
      errArray.push(el.error!);
      usePlayerStore.getState().actions.syncLoadingState();
    }
  });

  const getIsPlaying = () =>
    el?.currentTime > 0 &&
    !el?.paused &&
    !el?.ended &&
    el?.readyState > el?.HAVE_CURRENT_DATA;

  return {
    setSrc: (src: string) => (el.src = `/api/audio?url=${src}`),
    getSrc: () => el.src,
    pause: () => getIsPlaying() && el.pause(),
    play: () => !getIsPlaying() && el.play(),
    getIsPlaying,
    getDuration: () => el.duration,
    getCurrentTime: () => el.currentTime,
    setCurrentTime: (time: number) => (el.currentTime = time),
    setVolume: (volume: number) => (el.volume = volume),
    getIsLoading: () => el.readyState <= el.HAVE_CURRENT_DATA,
    getErrors: () => errArray,
    clearErrors: () => (errArray = []),
    setMuted: (mute: boolean) => (el.muted = mute),
  } as AudioController;
})();
