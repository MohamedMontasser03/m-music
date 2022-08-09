import {
  ActionIcon,
  Dialog,
  Group,
  Image,
  Slider,
  Stack,
  Text,
} from "@mantine/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  PlayerPause,
  PlayerPlay,
  PlayerTrackNext,
  PlayerTrackPrev,
} from "tabler-icons-react";
import { StoreType } from "../../app/store";
import { pause, play, seek, toggle } from "./playerSlice";

export const TrackPlayer: React.FC = () => {
  const {
    queue,
    currentTrack: idx,
    isPlaying,
    progress,
  } = useSelector((state: StoreType) => state.player);
  const dispatch = useDispatch();

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
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
          <Group>
            <ActionIcon disabled={idx <= 0} variant="outline" radius="xl">
              <PlayerTrackPrev size={15} />
            </ActionIcon>
            <ActionIcon
              variant="outline"
              radius="xl"
              onClick={() => dispatch(toggle())}
            >
              {isPlaying ? <PlayerPause size={15} /> : <PlayerPlay size={15} />}
            </ActionIcon>
            <ActionIcon
              disabled={idx === queue.length - 1}
              variant="outline"
              radius="xl"
            >
              <PlayerTrackNext size={15} />
            </ActionIcon>
          </Group>
        </Stack>
      </Group>
    </Dialog>
  );
};
