import { Dialog, Group, Image, Stack, Text } from "@mantine/core";
import React from "react";
import shallow from "zustand/shallow";
import { usePlayerStore } from "../../app/track-player/playerSlice";
import { PlayerControls } from "./PlayerControls";
import { ProgressControls } from "./progressControls";

export const TrackPlayer: React.FC = () => {
  const {
    queue,
    currentTrack: idx,
    loadingState,
  } = usePlayerStore(
    (state) => ({
      queue: state.queue,
      currentTrack: state.currentTrack,
      loadingState: state.loadingState,
    }),
    shallow
  );

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
            withPlaceholder
          />
          <Stack
            sx={{
              flexGrow: 1,
            }}
            justify="center"
            align="flex-start"
          >
            <Text lineClamp={1}>{queue[idx]?.title}</Text>
            <ProgressControls />
            <PlayerControls />
          </Stack>
        </Group>
      </Dialog>
      <Dialog
        opened={queue.length > 0 && loadingState !== "done"}
        position={{
          bottom: 0,
          left: 0,
        }}
      >
        {loadingState}
      </Dialog>
    </>
  );
};
