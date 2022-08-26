import { client } from "../../pages/_app";
import { audioController } from "./audioController";
import create from "zustand";
import { persist } from "zustand/middleware";
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
  url?: string;
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

export const usePlayerStore = create<stateType>()(
  persist(
    (set, get) =>
      ({
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
              playingData: { fetchingUrl },
              actions: { pause, play },
            } = get();
            let loadingState = prevState;
            const errArray = audioController?.getErrors();

            if (["done", "loadingData"].includes(loadingState)) {
              loadingState = audioController?.getIsLoading()
                ? "loadingData"
                : "done";
            }

            if (isFetchingUrl(loadingState) && !fetchingUrl) {
              loadingState =
                loadingState === "initialUrl" ? "errorUrl" : "errorFail";
            }

            if (errArray.length) {
              loadingState = errArray.length > 1 ? "errorFail" : "errorUrl";
              set({ loadingState });
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
              currentTrack:
                loadingState === "errorFail" ? 0 : state.currentTrack,
            }));
          },
          syncProgress() {
            if (!audioController || get().playingData.fetchingUrl) return;
            set({
              progress: audioController?.getCurrentTime(),
              isPlaying: audioController?.getIsPlaying(),
            });
          },
          pause() {
            const { isPlaying } = get();
            if (!audioController || !isPlaying) return;

            set({ isPlaying: false });
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
            if (
              newIdx !== undefined &&
              (newIdx < 0 || newIdx > queue.length - 1)
            )
              return;
            if (
              newIdx !== undefined &&
              playingData.id === queue[newIdx]?.id &&
              playingData.fetchingUrl
            )
              return;
            if (newIdx === undefined && playingData.fetchingUrl) return;

            if (newIdx !== undefined && playingData.id !== queue[newIdx]?.id) {
              audioController.clearErrors();
              queue[newIdx]!.url
                ? audioController?.setSrc(queue[newIdx]!.url!)
                : audioController?.pause();

              set({
                currentTrack: newIdx,
                playingData: {
                  id: queue[newIdx]!.id,
                  fetchingUrl: false,
                  url: queue[newIdx]!.url ?? "",
                },
                loadingState: queue[newIdx]!.url ? "done" : "initialUrl",
                isPlaying: false,
                progress: 0,
              });
            }

            if (
              isFetchingUrl(get().loadingState) &&
              !get().playingData.fetchingUrl
            ) {
              set((state) => ({
                ...state,
                playingData: {
                  ...state.playingData,
                  fetchingUrl: true,
                },
              }));
              getAudioUrl(queue[newIdx ?? currentTrack]!.id)
                .then(({ url, id }) => {
                  if (
                    id !== get().playingData.id ||
                    !get().playingData.fetchingUrl
                  )
                    return;
                  set((state) => ({
                    ...state,
                    queue: setUrl(state.queue, newIdx ?? currentTrack, url),
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
                  if (
                    queue[newIdx ?? currentTrack]!.id !== get().playingData.id
                  )
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

            set({ isPlaying: true });
            audioController?.play();
          },
          setProgress(progress: number, end?: boolean) {
            const {
              isPlaying,
              loadingState,
              actions: { play, pause },
            } = get();
            if (!audioController || isFetchingUrl(loadingState)) return;
            if (progress > audioController.getDuration() || progress < 0)
              return;
            if (isPlaying && !end) {
              pause();
            }
            if (!isPlaying && end) {
              play();
            }
            audioController.setCurrentTime(progress);
            set({ progress });
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
                progress:
                  state.queue[state.currentTrack]?.duration ?? state.progress,
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
              loadingState,
            } = get();
            if (!audioController) return;
            const timeBeforeReset = 10;
            if (currentTrack === 0 || progress > timeBeforeReset) {
              set({ progress: 0 });
              !isFetchingUrl(loadingState) && audioController.setCurrentTime(0);
              play();
              return;
            }
            play(currentTrack - 1);
          },
          setVolume(newVolume: number) {
            if (!audioController) return;
            if (newVolume > 1 || newVolume < 0) return;
            set({ volume: newVolume });
            audioController.setVolume(newVolume);
          },
          pushTrack(track: TrackType) {
            const {
              queue,
              actions: { play },
            } = get();
            if (!audioController) return;
            if (queue.some((t) => t.id === track.id)) return;
            set({ queue: [...queue, track] });
            play(queue.length - 1);
          },
          reorderQueue(from: number, to: number) {
            const { queue } = get();
            if (!audioController) return;
            if (from === to) return;
            if (
              from < 0 ||
              from >= queue.length ||
              to < 0 ||
              to >= queue.length
            )
              return;
            const newQueue = [...queue];
            const [removed] = newQueue.splice(from, 1);
            newQueue.splice(to, 0, removed!);
            set((state) => {
              let currentTrack = state.currentTrack;
              if (currentTrack === from) {
                currentTrack = to;
              } else if (from < currentTrack && currentTrack <= to)
                currentTrack--;
              else if (from > currentTrack && currentTrack >= to)
                currentTrack++;
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
            if (new Set(newQueue.map((t) => t.id)).size !== newQueue.length)
              return; // check if there are no duplicates
            set({ queue: newQueue });
            play(0);
          },
        },
      } as stateType),
    {
      name: "player-store",
      getStorage: () => localStorage,
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) => !["actions", "isPlaying"].includes(key)
          )
        ),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error(error);
          return;
        }
        if (!audioController || !state) return;
        if (state.playingData.url !== "") {
          audioController.setSrc(state.playingData.url);
          audioController.setCurrentTime(state.progress);
        }
        audioController.setVolume(state.volume);
      },
    }
  )
);

const getAudioUrl = async (id: string) => {
  const query = await client.query("playback.audio", { id });
  if (!query.url) throw new Error("No url found");
  return { url: query.url, id };
};

const setUrl = (queue: TrackType[], idx: number, url?: string) => {
  const newQueue = [...queue];
  newQueue[idx] = { ...newQueue[idx], url } as TrackType;
  return newQueue;
};

export const isFetchingUrl = (loadingState: stateType["loadingState"]) => {
  return loadingState === "initialUrl" || loadingState === "errorUrl";
};
