import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { audioController } from "./audioController";

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
  url: string;
  duration: number;
};

export const playerSlice = createSlice({
  name: "player",
  initialState: {
    queue: [] as TrackType[],
    currentTrack: 0,
    isPlaying: false,
    progress: 0,
    volume: 1,
  },
  reducers: {
    pause(state) {
      audioController?.pause();
      state.isPlaying = false;
      console.log("paused");
    },
    play(state, action: PayloadAction<number | undefined>) {
      if (!audioController) return;
      if (
        Number.isInteger(action?.payload) &&
        action?.payload! >= 0 &&
        action?.payload! < state.queue.length
      )
        state.currentTrack = action.payload!;
      if (audioController.src !== state?.queue[state?.currentTrack || 0]?.url) {
        audioController.src = state?.queue[state?.currentTrack || 0]?.url || "";
      }
      audioController?.play();
      state.isPlaying = true;
    },
    toggle(state) {
      if (!audioController) return;
      if (state.isPlaying) {
        audioController?.pause();
      } else {
        if (
          audioController.src !== state?.queue[state?.currentTrack || 0]?.url
        ) {
          audioController.src =
            state?.queue[state?.currentTrack || 0]?.url || "";
        }
        audioController.play();
      }
      state.isPlaying = !state.isPlaying;
    },
    syncProgress(state) {
      if (!audioController) return;
      state.progress = audioController.currentTime;
    },
    queNext(state) {
      if (!audioController) return;
      if (state.currentTrack === state.queue.length - 1) {
        audioController?.pause();
        state.isPlaying = false;
        return;
      }

      state.currentTrack = (state.currentTrack + 1) % state.queue.length;
      audioController.src = state.queue[state.currentTrack]?.url || "";
      audioController.play();
    },
    quePrev(state) {
      if (!audioController) return;
      if (state.currentTrack === 0) {
        audioController?.pause();
        state.isPlaying = false;
        return;
      }
      state.currentTrack = state.currentTrack - 1;
      audioController.src = state.queue[state.currentTrack]?.url || "";
      audioController.play();
    },
    seek(state, action: PayloadAction<number>) {
      if (!audioController) return;
      if (action.payload > audioController.duration || action.payload < 0)
        return;
      if (state.isPlaying) {
        audioController?.pause();
        state.isPlaying = false;
      }

      audioController.currentTime = action.payload;
      state.progress = action.payload;
    },
    setVolume(state, action: PayloadAction<number>) {
      if (!audioController) return;
      if (action.payload > 1 || action.payload < 0) return;
      audioController.volume = action.payload;
      state.volume = action.payload;
    },
    playPlaylist(state, action: PayloadAction<TrackType[]>) {
      if (!audioController) return;
      state.queue = action.payload;
      state.currentTrack = 0;
      audioController.src = state.queue[state.currentTrack]?.url || "";
      audioController.play();
      state.isPlaying = true;
    },
    push(state, action: PayloadAction<TrackType>) {
      if (!audioController) return;
      if (state.queue.some((t) => t.id === action.payload.id)) return;
      state.queue = [...state.queue, action.payload];
      state.currentTrack = state.queue.length - 1;
      audioController.src = state.queue[state.currentTrack]?.url || "";
      audioController.play();
      state.isPlaying = true;
    },
    reorder(
      state,
      action: PayloadAction<{
        from: number;
        to: number;
      }>
    ) {
      if (!audioController) return;
      const { from, to } = action.payload;
      if (from === to) return;
      if (
        from < 0 ||
        from >= state.queue.length ||
        to < 0 ||
        to >= state.queue.length
      )
        return;
      const newQueue = [...state.queue];
      const [removed] = newQueue.splice(from, 1);
      newQueue.splice(to, 0, removed!);
      state.queue = newQueue;
      // update currentTrack if it's in the new queue
      if (state.currentTrack === from) {
        state.currentTrack = to;
      } else if (from < state.currentTrack && state.currentTrack <= to)
        state.currentTrack--;
      else if (from > state.currentTrack && state.currentTrack >= to)
        state.currentTrack++;
    },
  },
});

export const {
  pause,
  toggle,
  syncProgress,
  queNext,
  play,
  seek,
  setVolume,
  quePrev,
  playPlaylist,
  push,
  reorder,
} = playerSlice.actions;

export default playerSlice.reducer;
