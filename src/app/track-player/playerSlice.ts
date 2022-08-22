import { client } from "../../pages/_app";
import { audioController } from "./audioController";
import create from "zustand";

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
    | "ErrorUrl"
    | "LoadingData"
    | "ErrorFail"
    | "Done";
  playingData: {
    id: string;
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
  loadingState: "Done",
  playingData: {
    url: "",
    id: "",
  },
  actions: {
    pause() {
      const { isPlaying } = get();
      if (!audioController || !isPlaying) return;

      set((state) => ({
        ...state,
        isPlaying: false,
      }));
      if (!audioController.getIsPlaying()) return;
      audioController?.pause();
    },
    play(newIdx?: number) {
      const {
        isPlaying,
        queue,
        playingData,
        loadingState,
        currentTrack,
        actions: { play },
      } = get();
      if (!audioController) return;
      if (isPlaying && newIdx === undefined) return;
      if (newIdx !== undefined && (newIdx < 0 || newIdx > queue.length - 1))
        return;
      if (
        (newIdx !== undefined && playingData.id !== queue[newIdx]?.id) ||
        loadingState === "initialUrl"
      ) {
        set((state) => ({
          ...state,
          currentTrack: newIdx ?? state.currentTrack,
          playingData: {
            id: queue[newIdx ?? state.currentTrack]!.id,
            url: "",
          },
          loadingState:
            loadingState === "initialUrl" ? "ErrorUrl" : "initialUrl",
          isPlaying: false,
        }));

        audioController.setCurrentTime(0);
        audioController?.pause();
        getAudioUrl(queue[newIdx ?? currentTrack]!.id)
          .then(({ url, id }) => {
            set((state) =>
              id === state.playingData.id
                ? {
                    ...state,
                    playingData: {
                      id: state.playingData.id,
                      url,
                    },
                    loadingState: "Done",
                    isPlaying: true,
                  }
                : state
            );
            audioController?.setSrc(url);
            audioController?.play();
          })
          .catch((err) => {
            console.error(err);
            set((state) => {
              state.loadingState === "initialUrl" && state.actions.play();
              return {
                ...state,
                loadingState:
                  state.loadingState === "ErrorUrl" ? "ErrorFail" : "ErrorUrl",
              };
            });
          });
        return;
      }
      set((state) => ({
        ...state,
        isPlaying: true,
      }));
      audioController?.play();
      return;
    },
    syncLoadingState() {
      if (!audioController) return;
      set((state) => {
        let loadingState = state.loadingState;
        if (audioController?.getError()) {
          loadingState !== "ErrorFail" && state.actions.play();
          return {
            ...state,
            loadingState:
              loadingState !== "ErrorFail" ? "ErrorFail" : "ErrorUrl",
          };
        }
        if (["Done", "LoadingData"].includes(loadingState)) {
          loadingState = audioController?.getIsLoading()
            ? "LoadingData"
            : "Done";
        }
        return {
          ...state,
          loadingState,
        };
      });
    },
    syncProgress() {
      if (!audioController) return;
      set((state) => ({
        ...state,
        progress: audioController!.getCurrentTime(),
      }));
    },
    setProgress(progress: number, end?: boolean) {
      const { isPlaying, loadingState } = get();
      if (!audioController) return;
      if (progress > audioController.getDuration() || progress < 0) return;
      if (isPlaying && !end) {
        // state.isPlaying = false;
        audioController?.pause();
      }

      audioController.setCurrentTime(progress);
      set((state) => ({
        ...state,
        progress,
        isPlaying: !isPlaying && end && loadingState !== "initialUrl",
      }));

      if (!isPlaying && end && loadingState !== "initialUrl") {
        audioController?.play();
      }
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
