import {
  isFetchingUrl,
  usePlayerStore,
} from "../../app/track-player/playerSlice";
import shallow from "zustand/shallow";
import { Group, Skeleton, Slider, Text } from "@mantine/core";
import { useCallback } from "react";

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
