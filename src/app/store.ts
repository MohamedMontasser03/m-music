import { configureStore } from "@reduxjs/toolkit";
import playerSlice from "../components/track-player/playerSlice";

export const store = configureStore({
  reducer: {
    player: playerSlice,
  },
});

export type StoreType = ReturnType<typeof store.getState>;
