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
      if (!audioController || !state.isPlaying) return;
      const isPlaying =
        audioController?.currentTime > 0 &&
        !audioController?.paused &&
        !audioController?.ended &&
        audioController?.readyState > audioController?.HAVE_CURRENT_DATA;
      if (!isPlaying) return;

      state.isPlaying = false;
      audioController?.pause();
    },
    play(state, action: PayloadAction<number | undefined>) {
      if (!audioController) return;
      if (
        state.isPlaying &&
        (action.payload === undefined || state.currentTrack === action.payload)
      )
        return;
      if (
        Number.isInteger(action?.payload) &&
        action?.payload! >= 0 &&
        action?.payload! < state.queue.length
      )
        state.currentTrack = action.payload!;
      if (audioController.src !== state?.queue[state?.currentTrack || 0]?.url) {
        audioController.src = state?.queue[state?.currentTrack || 0]?.url || "";
      }
      state.isPlaying = true;
      audioController?.play();
    },
    syncProgress(state) {
      if (!audioController) return;
      state.progress = audioController.currentTime;
    },
    setProgress(state, action: PayloadAction<number>) {
      if (!audioController) return;
      if (action.payload > audioController.duration || action.payload < 0)
        return;
      if (state.isPlaying) {
        state.isPlaying = false;
        audioController?.pause();
      }

      audioController.currentTime = action.payload;
      state.progress = action.payload;
    },
    playNext(state) {
      if (!audioController) return;
      if (state.currentTrack === state.queue.length - 1) {
        playerSlice.caseReducers.pause(state);
        state.progress =
          state.queue[state.currentTrack]?.duration ?? state.progress;
        return;
      }

      playerSlice.caseReducers.play(state, {
        payload: state.currentTrack + 1,
        type: "PLAY",
      });
    },
    playPrev(state) {
      if (!audioController) return;
      const timeBeforeReset = 10;
      if (state.currentTrack === 0 || state.progress > timeBeforeReset) {
        state.progress = 0;
        audioController.currentTime = 0;
        playerSlice.caseReducers.play(state, {
          payload: state.currentTrack,
          type: "PLAY",
        });
        return;
      }
      playerSlice.caseReducers.play(state, {
        payload: state.currentTrack - 1,
        type: "PLAY",
      });
    },
    setVolume(state, action: PayloadAction<number>) {
      if (!audioController) return;
      if (action.payload > 1 || action.payload < 0) return;
      state.volume = action.payload;
      audioController.volume = action.payload;
    },
    pushTrack(state, action: PayloadAction<TrackType>) {
      if (!audioController) return;
      if (state.queue.some((t) => t.id === action.payload.id)) return;
      state.queue = [...state.queue, action.payload];
      playerSlice.caseReducers.play(state, {
        payload: state.queue.length - 1,
        type: "PLAY",
      });
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
      // update currentTrack if it's in the queue
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
  syncProgress,
  playNext,
  play,
  setProgress,
  setVolume,
  playPrev,
  pushTrack,
  reorder,
} = playerSlice.actions;

export default playerSlice.reducer;
