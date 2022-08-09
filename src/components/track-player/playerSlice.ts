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
  length: number;
};

const mockData = [
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
  {
    title: "Odd Future",
    id: "2",
    authorName: "WoW",
    authorId: "1",
    length: 225,
    thumbnails: [
      {
        url: "https://lh3.googleusercontent.com/obNTp9iITqag6KC-0aKnPbNW05HZkseRG-zCnqrvDTv7VFKz5Zw3W5gzKpDlKRcEWFEDfdnmyQQU39Os=w544-h544-l90-rj",
        width: 480,
        height: 360,
      },
    ],
    url: "https://rr5---sn-hgn7yn76.googlevideo.com/videoplayback?expire=1660079723&ei=C3ryYvb1C4yJvdIPu8ak0Ao&ip=8.41.6.43&id=o-AKD_emZrdxGhojmfF54oueBXaFRzB2suJ_TR9BMGjROD&itag=251&source=youtube&requiressl=yes&mh=A7&mm=31,26&mn=sn-hgn7yn76,sn-25glen7y&ms=au,onr&mv=m&mvi=5&pl=24&gcr=fr&initcwndbps=646250&spc=lT-Khh7WoqTNXQ6Qa1GFDQ1AseKFF4lZh1TplmFOPS4p&vprv=1&mime=audio/webm&ns=Y28_ku3pn6fOx1qvdjpyPtIH&gir=yes&clen=3721629&dur=225.921&lmt=1580563546021356&mt=1660057759&fvip=5&keepalive=yes&fexp=24001373,24007246&c=WEB_REMIX&rbqsm=fr&txp=5431432&n=bisojJXvTJPhXg&sparams=expire,ei,ip,id,itag,source,requiressl,gcr,spc,vprv,mime,ns,gir,clen,dur,lmt&lsparams=mh,mm,mn,ms,mv,mvi,pl,initcwndbps&lsig=AG3C_xAwRQIhAO8xmmRRDyEOKIcaU65WwMHw-5LMrdSLq7bJtVziFMcjAiBDdcyUzQdwJ2eVFl0cGgGqnWquho4FKQt-WxU3FZMN4w==&alr=yes&sig=AOq0QJ8wRgIhAJia_JhnzH3gC8fhuyJ8wUad8PNvfF9Ox6-jNN5gzXR0AiEA3H0ohpAaBsNgCxH26HpfDYmbDKDvetKBEoz9jpdrYIE=&cpn=r_laSO7hi49KIS-w&cver=1.20220803.01.00&rn=6&rbuf=46968&pot=GpIBCmXdJfidbmzocW6IYoxC1UpnU_OfXWiMguKrqFalONIlnsYOGF_qC0BlV_3y95jocP-ZPKk4BObY60vUcDFoo7xwqZ3N9HraZxy_5xoWfxrFSWnx0xLO6OeWTBrd-EvAXLnFNXIEMRIpAX04kIjCVVK_8FTPry0Zk2pkl--PWD6le0VIBuUkrxknX9SCfrm7k3Q=",
  },
];

export const playerSlice = createSlice({
  name: "player",
  initialState: {
    queue: [...mockData] as TrackType[],
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
} = playerSlice.actions;

export default playerSlice.reducer;
