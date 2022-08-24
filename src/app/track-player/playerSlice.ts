import { client } from "../../pages/_app";
import { audioController } from "./audioController";
import create from "zustand";
import Router from "next/router";

export type TrackType = {
  title: string;
  id: string;
  authorName: string;
  authorId?: string;
  thumbnails: {
    url: string;
    width: number;
    height: number;
  }[];
  duration: number;
};

type stateType = {
  queue: TrackType[];
  currentTrack: number;
  isPlaying: boolean;
  progress: number;
  volume: number;
  loadingState:
    | "initialUrl"
    | "errorUrl"
    | "loadingData"
    | "errorFail"
    | "done";
  playingData: {
    id: string;
    fetchingUrl: boolean;
    url: string;
  };
  actions: {
    pause: () => void;
    play: (newIdx?: number) => void;
    syncLoadingState: () => void;
    syncProgress: () => void;
    setProgress: (progress: number, end?: boolean) => void;
    playNext: () => void;
    playPrev: () => void;
    setVolume: (newVolume: number) => void;
    pushTrack: (track: TrackType) => void;
    reorderQueue: (from: number, to: number) => void;
    setQueue: (newQueue: TrackType[]) => void;
  };
};

export const usePlayerStore = create<stateType>((set, get) => ({
  queue: [] as TrackType[],
  currentTrack: 0,
  isPlaying: false,
  progress: 0,
  volume: 1,
  loadingState: "done",
  playingData: {
    url: "",
    fetchingUrl: false,
    id: "",
  },
  actions: {
    syncLoadingState() {
      if (!audioController) return;
      const {
        loadingState: prevState,
        actions: { pause, play },
      } = get();
      let loadingState = prevState;

      if (audioController?.getError()) {
        // if the player hasn't failed then refetch the url to make sure the error isn't because of a bad url
        // but if it has failed then don't refetch the url
        loadingState = loadingState !== "errorFail" ? "errorFail" : "errorUrl";
      }

      if (["done", "loadingData"].includes(loadingState)) {
        loadingState = audioController?.getIsLoading() ? "loadingData" : "done";
      }

      if (isFetchingUrl(loadingState)) {
        loadingState = loadingState === "initialUrl" ? "errorUrl" : "errorFail";
      }

      loadingState === "errorUrl" && play();

      if (loadingState === "errorFail") {
        pause();
        Router.push("/error");
      }

      set((state) => ({
        ...state,
        loadingState,
        queue: loadingState === "errorFail" ? [] : state.queue,
        playingData:
          loadingState === "errorFail"
            ? {
                url: "",
                fetchingUrl: false,
                id: "",
              }
            : state.playingData,
        currentTrack: loadingState === "errorFail" ? 0 : state.currentTrack,
      }));
    },
    syncProgress() {
      if (!audioController) return;
      set((state) => ({
        ...state,
        progress: audioController?.getCurrentTime(),
        isPlaying: audioController?.getIsPlaying(),
      }));
    },
    pause() {
      const { isPlaying } = get();
      if (!audioController || !isPlaying) return;

      set((state) => ({
        ...state,
        isPlaying: false,
      }));
      audioController?.pause();
    },
    play(newIdx?: number) {
      const {
        queue,
        playingData,
        currentTrack,
        actions: { syncLoadingState },
      } = get();
      if (!audioController) return;
      if (newIdx !== undefined && (newIdx < 0 || newIdx > queue.length - 1))
        return;
      if (
        newIdx !== undefined &&
        playingData.id === queue[newIdx]?.id &&
        playingData.fetchingUrl
      )
        return;
      if (newIdx === undefined && playingData.fetchingUrl) return;

      if (newIdx !== undefined && playingData.id !== queue[newIdx]?.id) {
        audioController?.pause();

        set((state) => ({
          ...state,
          currentTrack: newIdx ?? state.currentTrack,
          playingData: {
            id: queue[newIdx ?? state.currentTrack]!.id,
            fetchingUrl: false,
            url: "",
          },
          loadingState: "initialUrl",
          isPlaying: false,
          progress: 0,
        }));
      }

      if (isFetchingUrl(get().loadingState) && !get().playingData.fetchingUrl) {
        set((state) => ({
          ...state,
          playingData: {
            ...state.playingData,
            fetchingUrl: true,
          },
        }));
        getAudioUrl(queue[newIdx ?? currentTrack]!.id)
          .then(({ url, id }) => {
            if (id !== get().playingData.id) return;
            set((state) => ({
              ...state,
              playingData: {
                id: state.playingData.id,
                fetchingUrl: false,
                url,
              },
              loadingState: "done",
              isPlaying: true,
            }));
            audioController?.setCurrentTime(0);
            audioController?.setSrc(url);
            audioController?.play();
          })
          .catch((err) => {
            if (queue[newIdx ?? currentTrack]!.id !== get().playingData.id)
              return;
            console.error(err);
            set((state) => ({
              ...state,
              playingData: {
                ...state.playingData,
                fetchingUrl: false,
              },
            }));
            syncLoadingState();
          });
        return;
      }

      set((state) => ({
        ...state,
        isPlaying: true,
      }));
      audioController?.play();
    },
    setProgress(progress: number, end?: boolean) {
      const {
        isPlaying,
        loadingState,
        actions: { play, pause },
      } = get();
      if (!audioController || isFetchingUrl(loadingState)) return;
      if (progress > audioController.getDuration() || progress < 0) return;
      if (isPlaying && !end) {
        pause();
      }
      if (!isPlaying && end) {
        play();
      }
      audioController.setCurrentTime(progress);
      set((state) => ({
        ...state,
        progress,
      }));
    },
    playNext() {
      const {
        currentTrack,
        queue,
        actions: { pause, play },
        progress,
      } = get();
      if (!audioController) return;
      if (currentTrack === queue.length - 1) {
        pause();
        set((state) => ({
          ...state,
          progress: state.queue[state.currentTrack]?.duration ?? state.progress,
        }));
        return;
      }

      play(currentTrack + 1);
    },
    playPrev() {
      const {
        currentTrack,
        actions: { play },
        progress,
      } = get();
      if (!audioController) return;
      const timeBeforeReset = 10;
      if (currentTrack === 0 || progress > timeBeforeReset) {
        set((state) => ({
          ...state,
          progress: 0,
        }));
        audioController.setCurrentTime(0);
        play();
        return;
      }
      play(currentTrack - 1);
    },
    setVolume(newVolume: number) {
      if (!audioController) return;
      if (newVolume > 1 || newVolume < 0) return;
      set((state) => ({
        ...state,
        volume: newVolume,
      }));
      audioController.setVolume(newVolume);
    },
    pushTrack(track: TrackType) {
      const {
        queue,
        actions: { play },
      } = get();
      if (!audioController) return;
      if (queue.some((t) => t.id === track.id)) return;
      set((state) => ({
        ...state,
        queue: [...state.queue, track],
      }));
      play(queue.length - 1);
    },
    reorderQueue(from: number, to: number) {
      const { queue } = get();
      if (!audioController) return;
      if (from === to) return;
      if (from < 0 || from >= queue.length || to < 0 || to >= queue.length)
        return;
      const newQueue = [...queue];
      const [removed] = newQueue.splice(from, 1);
      newQueue.splice(to, 0, removed!);
      set((state) => {
        let currentTrack = state.currentTrack;
        if (currentTrack === from) {
          currentTrack = to;
        } else if (from < currentTrack && currentTrack <= to) currentTrack--;
        else if (from > currentTrack && currentTrack >= to) currentTrack++;
        return {
          ...state,
          queue: newQueue,
          currentTrack,
        };
      });
    },
    setQueue(newQueue: TrackType[]) {
      const {
        actions: { play },
      } = get();
      if (!audioController) return;
      if (new Set(newQueue.map((t) => t.id)).size !== newQueue.length) return; // check if there are no duplicates
      set((state) => ({
        ...state,
        queue: newQueue,
      }));
      play(0);
    },
  },
}));

const getAudioUrl = async (id: string) => {
  const query = await client.query("playback.audio", { id });
  if (!query.url) throw new Error("No url found");
  return { url: query.url, id };
};

export const isFetchingUrl = (loadingState: stateType["loadingState"]) => {
  return loadingState === "initialUrl" || loadingState === "errorUrl";
};
