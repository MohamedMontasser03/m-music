import {
  isFetchingUrl,
  usePlayerStore,
} from "../../app/track-player/playerSlice";
import shallow from "zustand/shallow";
import { Group, Skeleton, Slider, Text } from "@mantine/core";
import { useCallback } from "react";
import { formatTime } from "../../utils/time";

export const ProgressControls: React.FC = () => {
  const [loadingState, progress, setProgress, queue, idx] = usePlayerStore(
    (state) => [
      state.loadingState,
      state.progress,
      state.actions.setProgress,
      state.queue,
      state.currentTrack,
    ],
    shallow
  );

  return (
    <Group
      sx={{
        width: "100%",
      }}
    >
      <Text>{formatTime(progress, queue[idx]?.duration)}</Text>
      <Skeleton
        visible={isFetchingUrl(loadingState)}
        sx={{
          width: "unset",
          flexGrow: 1,
        }}
      >
        <Slider
          label={(v) => formatTime(v)}
          value={Math.floor(progress)}
          max={queue[idx]?.duration}
          onChange={(value) => setProgress(value)}
          onChangeEnd={(value) => setProgress(value, true)}
          classNames={{
            root: loadingState === "loadingData" ? "brightnessLoader" : "",
          }}
        />
      </Skeleton>
      <Text>{formatTime(queue[idx]?.duration || 0)}</Text>
    </Group>
  );
};
