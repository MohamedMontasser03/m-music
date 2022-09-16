import {
  ActionIcon,
  Button,
  Dialog,
  Group,
  ScrollArea,
  Text,
} from "@mantine/core";
import { RefObject, useEffect, useRef, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import {
  ArrowsShuffle,
  Repeat,
  RepeatOff,
  RepeatOnce,
  X,
} from "tabler-icons-react";
import shallow from "zustand/shallow";
import { TrackType, usePlayerStore } from "../../app/track-player/playerSlice";
import { Image as ImageCP } from "../image/Image";

type Props = {
  opened: boolean;
  queue: TrackType[];
  currentTrack: number;
  onClose: () => void;
};

export const PlaylistView: React.FC<Props> = ({
  opened,
  queue,
  currentTrack: idx,
  onClose,
}) => {
  const [{ play, toggleLoop, reorderQueue }, { loop }] = usePlayerStore(
    (state) => [state.actions, state.playerOptions],
    shallow
  );
  const [reqScroll, setReqScroll] = useState(false);
  const [isDrag, setIsDrag] = useState(false);

  useEffect(() => {
    if (opened) {
      setReqScroll(true);
    }
  }, [opened]);

  return (
    <Dialog
      opened={opened}
      size="lg"
      radius="md"
      position={{
        right: 40,
        bottom: 100,
      }}
      onClose={onClose}
    >
      <Group mb="md" position="apart">
        <Group>
          <ActionIcon>
            <ArrowsShuffle />
          </ActionIcon>
          <ActionIcon onClick={() => toggleLoop()}>
            {loop === "none" ? (
              <RepeatOff />
            ) : loop === "one" ? (
              <RepeatOnce />
            ) : (
              <Repeat />
            )}
          </ActionIcon>
        </Group>
        <ActionIcon onClick={onClose} name="close">
          <X />
        </ActionIcon>
      </Group>
      <ScrollArea
        style={{
          height: 300,
        }}
      >
        <ReactSortable
          list={queue}
          animation={200}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
          setList={() => {}}
          onEnd={({ newIndex, oldIndex }) => {
            setIsDrag(false);
            if (!oldIndex || !newIndex || newIndex === oldIndex) return;
            reorderQueue(oldIndex, newIndex);
          }}
          setData={(dataTransfer) => {
            dataTransfer.setDragImage(new Image(), 0, 0);
          }}
          onStart={() => {
            setIsDrag(true);
          }}
        >
          {queue.map((track, i) => (
            <Button
              key={track.id}
              onClick={() => play(i)}
              variant={queue[idx]?.id !== track.id ? "subtle" : "light"}
              styles={{
                inner: {
                  justifyContent: "flex-start",
                },
                root: {
                  ":hover": isDrag
                    ? {
                        backgroundColor: "transparent",
                      }
                    : {},
                },
              }}
              p={4}
              size="lg"
              ref={(el: HTMLButtonElement | null) => {
                if (queue[idx]?.id !== track.id) return;
                reqScroll &&
                  el?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                setReqScroll(false);
              }}
            >
              <Group noWrap>
                <ImageCP
                  src={track.thumbnails[0]!.url}
                  width={40}
                  height={40}
                  alt={track.title}
                  fallback="https://www.gstatic.com/youtube/media/ytm/images/pbg/attribute-radio-fallback-2@1000.png"
                />
                <Text
                  style={{
                    wordBreak: "break-all",
                    whiteSpace: "initial",
                    fontSize: "initial",
                    lineHeight: "20px",
                  }}
                  lineClamp={2}
                >
                  {track.title}
                </Text>
              </Group>
            </Button>
          ))}
        </ReactSortable>
      </ScrollArea>
    </Dialog>
  );
};
