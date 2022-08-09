import { store } from "../../app/store";
import { pause, queNext, syncProgress } from "./playerSlice";

export const audioController = (() => {
  if (typeof window === "undefined") return undefined;
  const el = new Audio();
  el.addEventListener("timeupdate", () => {
    store.dispatch(syncProgress());
  });
  el.addEventListener("ended", () => {
    store.dispatch(queNext());
  });
  return el;
})();
