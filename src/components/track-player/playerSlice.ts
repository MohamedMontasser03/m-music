import { createSlice } from "@reduxjs/toolkit";
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
  length: number;
};

export const playerSlice = createSlice({
  name: "player",
  initialState: {
    queue: [
      {
        title: "Just One Step",
        id: "1",
        authorName: "Johnathan Young / Caleb",
        authorId: "1",
        length: 202,
        thumbnails: [
          {
            url: "https://lh3.googleusercontent.com/zPqzBs8-NenKABnb8KyaUEQWRorR7Xv7sUKqJy7ajWNYuDuFxrBKnMa1kIIw9M3Kptbj9-jSOYW1EtM=w200-h200-l90-rj",
            width: 480,
            height: 360,
          },
        ],
        url: "https://rr1---sn-hgn7rn7y.googlevideo.com/videoplayback?expire=1660070873&ei=eFfyYpqmM9jYxN8P9NO9iA0&ip=8.41.6.43&id=o-ANmUbYRsvlJPWHgBNELevsTEAK6WgAT9CAD7SKkfeqru&itag=251&source=youtube&requiressl=yes&mh=4X&mm=31,29&mn=sn-hgn7rn7y,sn-hgn7ynek&ms=au,rdu&mv=m&mvi=1&pl=24&initcwndbps=517500&spc=lT-Khkd-8ga5kZJLTzl9VCb9fLhUEr2e6XNJJCw2Uc2i&vprv=1&mime=audio/webm&ns=EsyRmzYNEfTUn5BGb4rZ_loH&gir=yes&clen=3081903&dur=202.121&lmt=1659590112339439&mt=1660048873&fvip=1&keepalive=yes&fexp=24001373,24007246&c=WEB_REMIX&rbqsm=fr&txp=5532434&n=rseCZATVSeyq1Q&sparams=expire,ei,ip,id,itag,source,requiressl,spc,vprv,mime,ns,gir,clen,dur,lmt&lsparams=mh,mm,mn,ms,mv,mvi,pl,initcwndbps&lsig=AG3C_xAwRQIhAP01HMPFNyUQAJaf2YGWWey5CCs1yyJurVe12SZ9tRRPAiA-QSSsEhRC5oMlpEsl_h64TyClSHwEqEkdXJg1_u4wBQ==&alr=yes&sig=AOq0QJ8wRQIhAP3ryDkleOX8E6Lwu1CvxGHlQrGe5aYTLuQ1WXCfDxUHAiBCnxh3t-KNyn8vX-Q3_K0GVt28iYf4ECOTI44uW-n8Rg==&cpn=j9hXgKFPAw9-OTtO&cver=1.20220803.01.00&rn=12&rbuf=30108&pot=GpIBCmVe-Y2R6Sz58jSE9R5c7TN0bD5UMv9Bbp4PCgjMfFG6K2KFux-0XWxBepiSmJZdrUINWMTAXiS2stSBN2sMUbnhw_9X8RkrJHHylCY848L2pLRB3e7Tk4g0_O98w_UmN_QwuMV0-RIpAX04kIguIbgAFiJHNOhrOyHp75wvBPLoJezy3F6QZ2Mm3XFaRvD_ZeY=",
      },
    ] as TrackType[],
    currentTrack: 0,
    isPlaying: false,
    progress: 0,
  },
  reducers: {
    pause(state) {
      audioController?.pause();
      state.isPlaying = false;
      console.log("paused");
    },
    play(state) {
      if (!audioController) return;
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
    seek(state, action) {
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
  },
});

export const { pause, toggle, syncProgress, queNext, play, seek } =
  playerSlice.actions;

export default playerSlice.reducer;
