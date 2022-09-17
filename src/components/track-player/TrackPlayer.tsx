import { Dialog, Group, Stack, Text } from "@mantine/core";
import React from "react";
import shallow from "zustand/shallow";
import { usePlayerStore } from "../../app/track-player/playerSlice";
import { Image } from "../image/Image";
import { PlayerControls } from "./PlayerControls";
import { ProgressControls } from "./ProgressControls";

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
              )[0]?.url || ""
            }
            width={150}
            height={150}
            alt={queue[idx]?.title || ""}
            fallback="https://www.gstatic.com/youtube/media/ytm/images/pbg/attribute-radio-fallback-2@1000.png"
          />
          <Stack
            sx={{
              flexGrow: 1,
            }}
            justify="center"
            align="flex-start"
          >
            <Text lineClamp={1} title={queue[idx]?.title}>
              {queue[idx]?.title}
            </Text>
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
