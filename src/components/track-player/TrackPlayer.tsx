import {
  ActionIcon,
  Button,
  Dialog,
  Group,
  Image,
  Slider,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { StoreType } from "../../app/store";
import {
  pause,
  play,
  queNext,
  quePrev,
  seek,
  setVolume,
  toggle,
} from "./playerSlice";

export const TrackPlayer: React.FC = () => {
  const {
    queue,
    currentTrack: idx,
    isPlaying,
    progress,
    volume,
  } = useSelector((state: StoreType) => state.player);
  const dispatch = useDispatch();
  const [isPlaylistOpen, setPlaylistOpen] = React.useState(false);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <>
      <Dialog opened={queue.length > 0} size="xl" radius="md">
        <Group>
          <Image
            src={queue[idx]?.thumbnails[0]?.url}
            width={150}
            height={150}
            alt={queue[idx]?.title}
          />
          <Stack
            sx={{
              flexGrow: 1,
            }}
            justify="center"
            align="center"
          >
            <Text>{queue[idx]?.title}</Text>
            <Group
              sx={{
                width: "100%",
              }}
            >
              <Text>{formatTime(progress)}</Text>
              <Slider
                label={(v) => formatTime(v)}
                value={Math.floor(progress)}
                max={queue[idx]?.length}
                onChange={(v) => dispatch(seek(v))}
                onChangeEnd={() => dispatch(play())}
                sx={{
                  flexGrow: 1,
                }}
              />
              <Text>{formatTime(queue[idx]?.length || 0)}</Text>
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
                  onChange={(v) => dispatch(setVolume(v))}
                />
              </Group>
              <Group>
                <ActionIcon
                  disabled={idx <= 0}
                  variant="outline"
                  radius="xl"
                  onClick={() => dispatch(quePrev())}
                >
                  <PlayerTrackPrev size={15} />
                </ActionIcon>
                <ActionIcon
                  variant="outline"
                  radius="xl"
                  onClick={() => dispatch(toggle())}
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
                  onClick={() => dispatch(queNext())}
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
      <Dialog
        opened={isPlaylistOpen}
        size="lg"
        radius="md"
        position={{
          right: 40,
          bottom: 100,
        }}
      >
        <Stack>
          {queue.map((track, i) => (
            <Button
              key={track.title}
              onClick={() => dispatch(play(i))}
              variant={idx !== i ? "subtle" : "light"}
              styles={{
                inner: {
                  justifyContent: "flex-start",
                },
              }}
              p={4}
            >
              <Group>
                <Image
                  src={track.thumbnails[0]?.url}
                  width={40}
                  height={40}
                  alt={track.title}
                />
                <Text>{track.title}</Text>
              </Group>
            </Button>
          ))}
        </Stack>
      </Dialog>
    </>
  );
};
