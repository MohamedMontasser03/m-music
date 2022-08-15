import { store } from "../../app/store";
import { pause, play, playNext, syncProgress } from "./playerSlice";

export const audioController = (() => {
  if (typeof window === "undefined") return undefined;
  const el = new Audio();
  el.addEventListener("timeupdate", () => {
    store.dispatch(syncProgress());
  });
  el.addEventListener("play", () => {
    store.dispatch(play());
  });
  el.addEventListener("pause", () => {
    store.dispatch(pause());
  });
  el.addEventListener("ended", () => {
    store.dispatch(playNext());
  });
  return el;
})();
