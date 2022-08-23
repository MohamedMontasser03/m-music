import {
  ActionIcon,
  Dialog,
  Group,
  Image,
  ScrollArea,
  Slider,
  Stack,
  Text,
} from "@mantine/core";
import React, { useCallback, useState } from "react";
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
import { usePlayerStore } from "../../app/track-player/playerSlice";
import { PlaylistView } from "./PlaylistView";

export const TrackPlayer: React.FC = () => {
  const {
    queue,
    currentTrack: idx,
    isPlaying,
    progress,
    volume,
    actions: { pause, play, setProgress, setVolume, playNext, playPrev },
    loadingState,
  } = usePlayerStore();
  const [isPlaylistOpen, setPlaylistOpen] = useState(false);

  const formatTime = useCallback((time: number, max?: number) => {
    const includeHours = (max ?? 0) / 3600 > 1 || (time ?? 0) / 3600 > 1;
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor(time / 60) % 60;
    const seconds = Math.floor(time % 60);
    return `${
      includeHours ? `${hours}:${minutes < 10 ? "0" : ""}` : ""
    }${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }, []);

  return (
    <>
      <Dialog opened={queue.length > 0} size="xl" radius="md">
        <Group noWrap>
          <Image
            src={
              [...(queue[idx]?.thumbnails || [])].sort(
                (a, b) => b.width - a.width
              )[0]?.url
            }
            width={150}
            height={150}
            alt={queue[idx]?.title}
          />
          <Stack
            sx={{
              flexGrow: 1,
            }}
            justify="center"
            align="flex-start"
          >
            <Text lineClamp={1}>{queue[idx]?.title}</Text>
            <Group
              sx={{
                width: "100%",
              }}
            >
              <Text>{formatTime(progress, queue[idx]?.duration)}</Text>
              <Slider
                label={(v) => formatTime(v)}
                value={Math.floor(progress)}
                max={queue[idx]?.duration}
                onChange={(value) => setProgress(value)}
                onChangeEnd={(value) => setProgress(value, true)}
                sx={{
                  flexGrow: 1,
                }}
              />
              <Text>{formatTime(queue[idx]?.duration || 0)}</Text>
            </Group>
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
                  {volume > 0.5 ? (
                    <Volume />
                  ) : volume > 0 ? (
                    <Volume2 />
                  ) : (
                    <Volume3 />
                  )}
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
                <ActionIcon
                  variant="outline"
                  radius="xl"
                  onClick={() => playPrev()}
                >
                  <PlayerTrackPrev size={15} />
                </ActionIcon>
                <ActionIcon
                  variant="outline"
                  radius="xl"
                  onClick={() =>
                    !["initialUrl", "ErrorUrl"].includes(loadingState) &&
                    (isPlaying ? pause() : play())
                  }
                >
                  {isPlaying ? (
                    <PlayerPause size={15} />
                  ) : (
                    <PlayerPlay size={15} />
                  )}
                </ActionIcon>
                <ActionIcon
                  disabled={idx === queue.length - 1}
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
          </Stack>
        </Group>
      </Dialog>
      <PlaylistView
        currentTrack={idx}
        opened={isPlaylistOpen}
        queue={queue}
        onClose={() => setPlaylistOpen(false)}
      />
      <Dialog
        opened={queue.length > 0 && loadingState !== "Done"}
        position={{
          top: 0,
        }}
      >
        {loadingState}
      </Dialog>
    </>
  );
};
