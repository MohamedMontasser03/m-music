import { ActionIcon, Group, Skeleton, Slider } from "@mantine/core";
import { useState } from "react";
import {
  PlayerPause,
  PlayerPlay,
  PlayerTrackNext,
  PlayerTrackPrev,
  Playlist,
  Volume,
  Volume2,
  Volume3,
} from "tabler-icons-react";
import shallow from "zustand/shallow";
import {
  isFetchingUrl,
  usePlayerStore,
} from "../../app/track-player/playerSlice";
import { PlaylistView } from "./PlaylistView";

export const PlayerControls: React.FC = () => {
  const [
    loadingState,
    volume,
    { pause, play, playNext, playPrev, setVolume },
    queue,
    idx,
    isPlaying,
    { loop },
  ] = usePlayerStore(
    (state) => [
      state.loadingState,
      state.volume,
      state.actions,
      state.queue,
      state.currentTrack,
      state.isPlaying,
      state.playerOptions,
    ],
    shallow
  );
  const [isPlaylistOpen, setPlaylistOpen] = useState(false);

  return (
    <>
      <Group
        position="apart"
        sx={{
          width: "100%",
        }}
      >
        <Group
          sx={{
            flexGrow: 1,
          }}
          spacing={0}
        >
          <ActionIcon>
            {volume > 0.5 ? <Volume /> : volume > 0 ? <Volume2 /> : <Volume3 />}
          </ActionIcon>
          <Slider
            sx={{
              flexGrow: 1,
            }}
            label={(v) => Math.floor(v * 100) + "%"}
            value={volume}
            max={1}
            step={0.01}
            onChange={(v) => setVolume(v)}
          />
        </Group>
        <Group>
          <ActionIcon variant="outline" radius="xl" onClick={() => playPrev()}>
            <PlayerTrackPrev size={15} />
          </ActionIcon>
          <Skeleton
            visible={isFetchingUrl(loadingState)}
            width={28}
            height={28}
            circle
          >
            <ActionIcon
              variant="outline"
              radius="xl"
              onClick={() => (isPlaying ? pause() : play())}
            >
              {isPlaying ? <PlayerPause size={15} /> : <PlayerPlay size={15} />}
            </ActionIcon>
          </Skeleton>
          <ActionIcon
            disabled={idx === queue.length - 1 && loop !== "all"}
            variant="outline"
            radius="xl"
            onClick={() => playNext()}
          >
            <PlayerTrackNext size={15} />
          </ActionIcon>
        </Group>
        <Group>
          <ActionIcon onClick={() => setPlaylistOpen((v) => !v)}>
            <Playlist />
          </ActionIcon>
        </Group>
      </Group>

      <PlaylistView
        currentTrack={idx}
        opened={isPlaylistOpen}
        queue={queue}
        onClose={() => setPlaylistOpen(false)}
      />
    </>
  );
};
